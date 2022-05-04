---
title: 'Blocks Falling'
description: 'A deep-dive into the code of this game where players must rotate falling blocks and fit them together into lines.'
coverImage: '/images/projects/blocks-falling/hero-screenshot.png'
published: '2022-05-03' # TODO - Update this
tags: 'React, Redux Toolkit, Firebase'
---

At one point in time, this app went by a different name.

I didn't really think anyone would care. Building it was a personal challenge, and another app to add to my portfolio. I didn't think more than about three people would ever play it.

Turns out some that some people do care. And they have lawyers. So I had to do a complete rebrand.

So based on this [completely unrelated video game trailer](https://youtu.be/Mr8fVT_Ds4Q) (which just so happens to be the greatest trailer in video game history), I rebranded to 'Blocks Falling.'

## Background

Based on the above, I want to stress that this app has no relation to any existing video game, ever, and any resemblance is purely coincidental.

However, my motivation for building this app was 2-fold.

I'd always enjoyed playing games as a child, and building one myself that resembled nothing that I'd ever played in my youth, gave me a good feeling of nostalgia.

I also just wanted the challenge. I didn't know if my coding skills were capable of completing this project.

The other reason, was I wanted to push the limits of what React and Redux Toolkit are capable of. As you'll see when we go over the code below, this app uses Redux Toolkit. A lot. More than I'd ever used it before. And I wanted to see for myself if it was capable of handling such a load.

Luckily it was, otherwise this experiment would have turned into a huge waste of time.

So now let's take a deeper dive into the code, and how I built this completely original and unique game.

## Tools

The stack for this app is incredibly simple. It started from [create-react-app](https://github.com/facebook/create-react-app), with **React 17.0.2**. I added **Redux Toolkit 1.7.2** (as well as react-redux), and that is it.

The only other package you'll find is [array-of-numbers](/packages/array-of-numbers), which is a package I wrote _after_ building this app, and I needed to test that it actually worked, so I imported it in this project. It wasn't really necessary.

## The game board

The first question I needed to answer when creating this app, was what on earth do I use for the game board?

Believe it or not, the app doesn't have any images in it. Not one. Everything is done with CSS.

The game board itself is a 10x21 grid (the 21st row got added later in the development process), and in its initial form, this was arrays nested three deep, for example:

```js
[
  [
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
  ],
  [
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
    ['empty', ''],
  ],
  // etc.
];
```

The above output was created with:

```js
Array.from(new Array(20), (_, i) => i + 1).map(_ =>
  Array.from(new Array(10), (_, n) => n + 1).map(_ => ['empty', ''])
);
```

The `'empty'` values above represent the status of that "square"; we'll go over that in more detail in a moment. The second value is the name of the block (although being initially empty, that is why it is an empty string).

However, what I quickly found was that keeping track of and updating all of these values while using array indexes of arrays nested three-deep was a God-awful process.

So I instead updated to use nested objects.

In its ultimate form, this is created with:

```js
import arrayOfNumbers from 'array-of-numbers';

export const deadRow = arrayOfNumbers().reduce(
  (acc, curr) => ((acc[curr] = { status: dead, block: '' }), acc),
  {}
);

export const emptyRow = arrayOfNumbers().reduce(
  (acc, curr) => ((acc[curr] = { status: empty, block: '' }), acc),
  {}
);

const initialSquares = () => {
  const returnObject = arrayOfNumbers(1, 20).reduce(
    (acc, curr) => ((acc[curr] = emptyRow), acc),
    {}
  );
  returnObject[0] = deadRow;
  return returnObject;
};
```

You can read more about the [array-of-numbers package here](/packages/array-of-numbers), but very simply it returns an array of integers:

```js
import arrayOfNumbers from 'array-of-numbers';

console.log(arrayOfNumbers()); // [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
console.log(arrayOfNumbers(1, 20)); // [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ]
```

The `reduce` function is a bit of a sticky one to get your head around, particularly when it's used like this, but let me do my best to try and explain.

`reduce` returns a single value. It "reduces" your array into a single value. In this case, that single value just so happens to be a rather large object.

`reduce` loops over all the elements of the array that it's called on. `acc` (short for 'accumulator') is the accumulated value to be returned, after that iteration. `curr` (short for 'current'), is the current element from the array that we're iterating over.

Confused?

Yeah, I have that affect on people.

Let's look at a simpler example:

```js
[1, 2, 3, 4].reduce((acc, curr) => acc + curr);
```

Here, we're looping over this array. As we haven't passed-in a starting value, our `acc` starts at zero. So on the first iteration, where `acc` is zero, `curr` (the first element in our array) is `1`. So `acc + curr` is equal to `0 + 1`, so we return `1`.

This value that we return, is the value of `acc` for the next iteration. So on the second iteration, `acc` is `1`, and `curr` (the second element in our array) is `2`. So `1 + 2`, we return `3` from the second iteration of our loop.

Now `acc` is `3`, and on the third iteration, `curr` is also set to `3` (the third element in our array). So on this iteration `3 + 3` returns `6`.

On the final iteration of our loop, `acc` is therefore `6`. `curr` is `4` (the last element in our array). So `6 + 4`, the above function returns `10`.

Simple enough so far, right?

Let's add one more element to our function:

```js
[1, 2, 3, 4].reduce((acc, curr) => acc + curr, 10);
```

In this example, a `10` has been added, and what this does is set the initial value of `acc`. So on our first iteration, instead of `acc` being `0`, it starts as `10`. With `curr` being `1`, on our first iteration we run `10 + 1` to return `11`.

On the second iteration, `acc` is therefore set to `11`, so `11 + 2` returns `13`.

On the third iteration, `acc` is `13`, so `13 + 3` returns `16`.

On the final iteration, `acc` is `16`, so `16 + 4`, we return `20` from this function.

Now let's go back to the code that we're using to generate our game board, and look at the `emptyRow` variable:

<!-- prettier-ignore -->
```js
export const emptyRow = arrayOfNumbers().reduce((acc, curr) => ((acc[curr] = { status: empty, block: '' }), acc), {});
```

In this instance, `{}` is our initial value. On the first iteration, we're setting `acc` to an empty object.

Let me change this code slightly, to make it easier to go over:

```js
[1, 2, 3, 4].reduce((acc, curr) => ((acc[curr] = { status: 'empty' }), acc), {});
```

So what happens on the first iteration here?

`acc` is set to `{}`.

Perhaps the most confusing part is `(acc[curr] = { status: 'empty' }), acc)`. What this does, is set a key of `curr` on the `acc` object, set its value to `{ status: 'empty' }`, and then return this updated `acc` object.

Let me simplify this to make it easier to understand:

<!-- prettier-ignore -->
```js
const myFunction = () => (1 + 1)
```

From the above code, if I run `myFunction()` it will return `2`.

<!-- prettier-ignore -->
```js
const myFunction = () => ((1 + 1))
```

In this line of code, if I run `myFunction()` it will return `2`.

<!-- prettier-ignore -->
```js
const myFunction = () => ((1 + 1), 999)
```

However, in this line, if I run `myFunction()` it will return `999`, because `999` is the last value in the equation.

<!-- prettier-ignore -->
```js
const myFunction = () => (999, (1 + 1))
```

If I run `myFunction()` now, it will return `2` again, because `(1 + 1)` is the last value.

Going back to `(acc[curr] = { status: 'empty' }), acc)`, the `acc[curr] = { status: 'empty' }` part runs, even though it is not returned. What we return from this line, is the last value, and that is our updated `acc`.

```js
[1, 2, 3, 4].reduce((acc, curr) => ((acc[curr] = { status: 'empty' }), acc), {});
```

To go back to this line again, on our first iteration, `acc` is set to the initial value of `{}`. `curr` is set to `1`.

`acc[curr] = { status: 'empty' }` sets a key of `1` in our object, and gives it the value of another object `{ status: 'empty' }`. We then return `acc`.

So after one iteration, what we have returned is `{ '1': { status: 'empty' } }`.

Therefore, in our second iteration, `acc` is set to `{ '1': { status: 'empty' } }`, and `curr` is set to `2`.

With `acc[curr] = { status: 'empty' }` we therefore set a key of `2`, and give it a value of `{ status: 'empty' }`. We return this updated object, so our return from the second iteration is `{ '1': { status: 'empty' }, '2': { status: 'empty' } }`.

In our third iteration, `acc` is therefore set to `{ '1': { status: 'empty' }, '2': { status: 'empty' } }`, and `curr` is set to `3`, so from this iteration we return `{ '1': { status: 'empty' }, '2': { status: 'empty' }, '3': { status: 'empty' } }`.

On our final iteration, `acc` is set to `{ '1': { status: 'empty' }, '2': { status: 'empty' }, '3': { status: 'empty' } }`, with `curr` being set to `4`.

After this final iteration, what we return from this function is `{ '1': { status: 'empty' }, '2': { status: 'empty' }, '3': { status: 'empty' }, '4': { status: 'empty' } }`.

Now let's go back to our full `emptyRow` variable:

<!-- prettier-ignore -->
```js
export const emptyRow = arrayOfNumbers().reduce((acc, curr) => ((acc[curr] = { status: empty, block: '' }), acc), {});
```

Here, `arrayOfNumbers()` is `[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]`, and `empty` is set to `'empty'`. So when we run our `reduce` function, what is returned is:

```js
{
  '1': { status: 'empty', block: '' },
  '2': { status: 'empty', block: '' },
  '3': { status: 'empty', block: '' },
  '4': { status: 'empty', block: '' },
  '5': { status: 'empty', block: '' },
  '6': { status: 'empty', block: '' },
  '7': { status: 'empty', block: '' },
  '8': { status: 'empty', block: '' },
  '9': { status: 'empty', block: '' },
  '10': { status: 'empty', block: '' }
}
```

Phew. All that just to get one empty row of our game board.

Now let's go back to our code to create the entire starting game board:

```js
import arrayOfNumbers from 'array-of-numbers';

export const deadRow = arrayOfNumbers().reduce(
  (acc, curr) => ((acc[curr] = { status: dead, block: '' }), acc),
  {}
);

export const emptyRow = arrayOfNumbers().reduce(
  (acc, curr) => ((acc[curr] = { status: empty, block: '' }), acc),
  {}
);

const initialSquares = () => {
  const returnObject = arrayOfNumbers(1, 20).reduce(
    (acc, curr) => ((acc[curr] = emptyRow), acc),
    {}
  );
  returnObject[0] = deadRow;
  return returnObject;
};
```

When we call our `initialSquares()` function, we run `reduce()` on `arrayOfNumbers(1, 20)` (which returns `[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]`).

However, the difference is that we're setting `acc[curr]` to be our `emptyRow` variable.

We do this on all 20 elements of our array, and finally with `returnObject[0] = deadRow;`, set a 21st row where the status is set to `dead` (I'll go over the reasons for this in a second).

Therefore, based on the above code, calling `initialSquares()` returns (I omitted '3' to '19' for everyone's sanity):

```js
{
  '0': {
    '1': {
      'status': 'dead',
      'block': ''
    },
    '2': {
      'status': 'dead',
      'block': ''
    },
    '3': {
      'status': 'dead',
      'block': ''
    },
    '4': {
      'status': 'dead',
      'block': ''
    },
    '5': {
      'status': 'dead',
      'block': ''
    },
    '6': {
      'status': 'dead',
      'block': ''
    },
    '7': {
      'status': 'dead',
      'block': ''
    },
    '8': {
      'status': 'dead',
      'block': ''
    },
    '9': {
      'status': 'dead',
      'block': ''
    },
    '10': {
      'status': 'dead',
      'block': ''
    }
  },
  '1': {
    '1': {
      'status': 'empty',
      'block': ''
    },
    '2': {
      'status': 'empty',
      'block': ''
    },
    '3': {
      'status': 'empty',
      'block': ''
    },
    '4': {
      'status': 'empty',
      'block': ''
    },
    '5': {
      'status': 'empty',
      'block': ''
    },
    '6': {
      'status': 'empty',
      'block': ''
    },
    '7': {
      'status': 'empty',
      'block': ''
    },
    '8': {
      'status': 'empty',
      'block': ''
    },
    '9': {
      'status': 'empty',
      'block': ''
    },
    '10': {
      'status': 'empty',
      'block': ''
    }
  },
  '2': {
    '1': {
      'status': 'empty',
      'block': ''
    },
    '2': {
      'status': 'empty',
      'block': ''
    },
    '3': {
      'status': 'empty',
      'block': ''
    },
    '4': {
      'status': 'empty',
      'block': ''
    },
    '5': {
      'status': 'empty',
      'block': ''
    },
    '6': {
      'status': 'empty',
      'block': ''
    },
    '7': {
      'status': 'empty',
      'block': ''
    },
    '8': {
      'status': 'empty',
      'block': ''
    },
    '9': {
      'status': 'empty',
      'block': ''
    },
    '10': {
      'status': 'empty',
      'block': ''
    }
  },
  // etc.
  '20': {
    '1': {
      'status': 'empty',
      'block': ''
    },
    '2': {
      'status': 'empty',
      'block': ''
    },
    '3': {
      'status': 'empty',
      'block': ''
    },
    '4': {
      'status': 'empty',
      'block': ''
    },
    '5': {
      'status': 'empty',
      'block': ''
    },
    '6': {
      'status': 'empty',
      'block': ''
    },
    '7': {
      'status': 'empty',
      'block': ''
    },
    '8': {
      'status': 'empty',
      'block': ''
    },
    '9': {
      'status': 'empty',
      'block': ''
    },
    '10': {
      'status': 'empty',
      'block': ''
    }
  }
}
```

So after a good 10 minutes of our lives that none of us are getting back again, what was the point of all of that?

Well, the return from `initialSquares()` is our starting game board.

It is one giant object. Within that object are 21 child objects, with the keys `0` to `20`. Each of these children represent one row of our game board, going from top to bottom.

Within each of these rows, are ten more child objects, with the keys `1` to `10`. Each of _these_ children represent a square within a row, going from left to right.

Then within each of _these_ objects, is another object... completing our objectception. And in these final objects are two keys: `status` and `block`.

Each square within our grid can be one of four statuses:

- `'live'`
  - This is a square that includes part of a 'block' that is currenly in play.
- `'settled'`
  - This is a square that includes part of a block that has "settled" at the bottom of our game board.
- `'empty'`
  - This is a square that does not include part of a live or a settled block.
- `'dead'`
  - This is reserved exclusively for the top row of the game board. It is not part of the game, in that you cannot "settle" a block in the dead row. However, as some blocks take up 2 rows when they join the game board, having this dead row allows blocks to be added, without immediately ending the game for a player whose stack of settled blocks is already up to the second-to-top row.

Does that last one seem complicated and unnecessary? It wasn't included in the early iterations of this game. However, I quickly realised that it was a necessary addition, so the dead row lives... if you know what I mean.

In order for the square to know what color it needs to be, the value of `block` (if the square is not `empty` or `dead`) will be one of the seven block names.

So that is it; that is our game board. It's 210 squares, organised by row, where each square has a `status` and a `block` attribute. And in order for the game to work, all we have to do is keep track of all 210 squares, and update them based on the player's actions, and automated actions.

Simple, right?

## Redux Toolkit

So how do we keep track of the status of our game board? Well that's where Redux Toolkit comes into the equation.

We want to store our game board in state, but seeing as it's going to be the key component to our app, and will need to be accessed from everywhere, then it makes sense to store it in a global state.

That's exactly what Redux does.

I'm not going to go over the basics of Redux Toolkit here, or how to install it in your app ([this is the commit](https://github.com/jro31/blocks-falling/commit/ac3a15dc3e985af56c0e434a0292223420b63ec1) where I added Redux Toolkit to my master branch); I'll assume that you know the basics.

This app only has two state slices, with the most important of these being the `gameBoardSlice`, whose initial state is as follows:

```js
const initialState = {
  squares: initialSquares(),
  speed: 1000,
  liveBlock: blocks[Math.floor(Math.random() * blocks.length)],
  blockCounter: 0,
  timer: { isLive: true },
  status: preGame,
  clearedRows: 0,
  backgroundOne: backgrounds[Math.floor(Math.random() * backgrounds.length)],
  backgroundTwo: backgrounds[Math.floor(Math.random() * backgrounds.length)],
  liveBackground: 'one',
};
```

We'll touch on all parts of this state through this article. However, at this point the important thing to know is that our `initialSquares()` function is set to `squares`.

Within our store, the game board reducer is imported as follows:

```js
// src/store/index.js

import { configureStore } from '@reduxjs/toolkit';

import gameBoardReducer from './game-board';
import topScoreReducer from './top-score';

const store = configureStore({
  reducer: {
    gameBoard: gameBoardReducer,
    topScore: topScoreReducer,
  },
});

export default store;
```

Therefore, we can access our game board anywhere in our app using:

```js
useSelector(state => state.gameBoard.squares);
```

But what is a game board without any pieces?

Well it's not a very fun game, so let's fix that.

## The blocks

In Blocks Falling, there are seven different kinds of blocks.

I came up with these seven blocks completely on my own while sitting in a dark room without power, food or water. If you think you've seen them somewhere before... you haven't.

![Blocks](/images/projects/blocks-falling/blocks.jpeg)

I gave these seven blocks that I invented on my own, unique and original letter-based names depending on their shape.

Reading from left to right and top to bottom, these are `I`, `J`, `L`, `O`, `S`, `T` and `Z`.

## Adding blocks to the game board

First off, adding a block to our game board. What does that actually mean?

Ruining the illusion of actually playing a fun video game, it simply means that we update the `status` and `block` values of the relevant 'squares' within our game board to be `live` and the name of the block respectively.

Inject that into my veins.

Let's go to the very beginning, of what happens when a player starts the game.

There are two ways that a player can start a game.

If they're on a computer, they can press the space bar. Alternatively, if they don't have a keyboard or they just feel like living a little, they can click the play/pause button.

The former of these methods is handled in the `GameBoard` component. We add an event listener as the component loads with `useEffect`:

```js
import { useEffect } from 'react';

useEffect(() => {
  document.addEventListener('keydown', handleKeyPress);

  return () => {
    document.removeEventListener('keydown', handleKeyPress);
  };
}, []);
```

This event listener points at the `handleKeyPress` function, so whenever a key is pressed, we call `handleKeyPress()`.

The `handleKeyPress()` function is a switch/case statement that looks at which key was pressed, and takes action accordingly:

```js
import { useRef } from 'react';
import { useSelector } from 'react-redux';

import { gameOver, inProgress, paused, preGame, } from '../store/game-board';
import useBeginGame from '../hooks/use-begin-game';

export let statusRef;

const GameBoard = () => {
  const status = useSelector(state => state.gameBoard.status);
  statusRef = useRef(status);
  statusRef.current = status;

  const beginGame = useBeginGame();

  const handleKeyPress = event => {
    switch (event.key) {
      case 'ArrowDown':
        ...
      case 'ArrowLeft':
        ...
      case 'ArrowRight':
        ...
      case 'z':
        ...
      case 'x':
        ...
      case ' ':
        event.preventDefault();
        if (statusRef.current === preGame || statusRef.current === gameOver) {
          beginGame();
        } else if (statusRef.current === inProgress) {
          dispatch(gameBoardActions.pauseGame());
        } else if (statusRef.current === paused) {
          dispatch(gameBoardActions.resumeGame());
        }
        break;
      default:
        return;
    }
  };
};
```

For simplicity, I've removed all the actions we take _apart_ from when the space bar (`' '`) is pressed.

You may be asking yourself, what on earth is going on in this code?

```js
const status = useSelector(state => state.gameBoard.status);
statusRef = useRef(status);
statusRef.current = status;
```

Good question. And it's just taken me half a day looking back over my commit history and my stack overflow history to figure it out.

Within the `GameBoard` component, we also have:

```js
export let squaresRef;

const GameBoard = () => {
  const squares = useSelector(state => state.gameBoard.squares);
  squaresRef = useRef(squares);
  squaresRef.current = squares;
};
```

It does the exact same thing, although with the `squares` state, rather than `status`, but I think it's easier to explain with `squares` (which is our game board).

If you play the game, you'll notice that blocks fall to the row below at timed intervals.

This starts at one second intervals, and slowly this speed increases as the game proceeds.

This 'timer' until the block drops, is set with a `setTimeout()` function set in `useEffect`:

```js
import { useSelector } from 'react-redux';

import { down, inProgress } from '../store/game-board';
import useMoveBlock from '../hooks/use-move-block';

let timeOut;

const GameBoard = () => {
  const speed = useSelector(state => state.gameBoard.speed);
  const timer = useSelector(state => state.gameBoard.timer);
  const status = useSelector(state => state.gameBoard.status);

  const moveBlock = useMoveBlock();

  useEffect(() => {
    if (status === inProgress) {
      if (timer.isLive) {
        timeOut = setTimeout(() => {
          moveBlock(down);
        }, speed);
      }
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [status, timer]);
};
```

And when we call `setTimeout()` here, we set the timer to call `moveBlock(down)` _after_ the `speed` interval; so anything up to one second into the future.

We'll go over the code of the `useMoveBlock` hook a little later, but what it essentially does, is take the existing game board, update it with our block moved into its new position, and then call the Redux Toolkit action to update the game board, passing-in the updated game board as an argument.

The problem here, is that if I were to fetch the existing game board within `useMoveBlock` in the usual Redux Toolkit way of

```js
const squares = useSelector(state => state.gameBoard.squares);
```

then it would use the game board state at the time that `setTimeout()` was called, and **not** after the interval. So we'd be using a game board that was up to a second old.

```js
export let squaresRef;

const GameBoard = () => {
  const squares = useSelector(state => state.gameBoard.squares);
  squaresRef = useRef(squares);
  squaresRef.current = squares;
};
```

This code sets the game board (`squares`) to a ref variable `squaresRef`, and exports it. We can then call `current` on `squaresRef`, and this will always be the updated version of the game board.

That means that it doesn't matter that we called our `useMoveBlock` hook up to a second ago, by importing `squaresRef` and calling `squaresRef.current`, we can guarantee that we are working with the latest version of the game board.

It's the same with:

```js
const status = useSelector(state => state.gameBoard.status);
statusRef = useRef(status);
statusRef.current = status;
```

By calling importing `statusRef` and then calling `statusRef.current`, it simply guarantees that the state that we are using is current state.

Make sense?

Good.

[Note to self - Add a better explanation of this before publishing]

Onto what happens within the switch/case statement when the space bar is pressed:

```js
const handleKeyPress = event => {
  switch (event.key) {
    case ' ':
      event.preventDefault();
      if (statusRef.current === preGame || statusRef.current === gameOver) {
        beginGame();
      } else if (statusRef.current === inProgress) {
        dispatch(gameBoardActions.pauseGame());
      } else if (statusRef.current === paused) {
        dispatch(gameBoardActions.resumeGame());
      }
      break;
    default:
      return;
  }
};
```

Assuming that `statusRef.current === preGame` is true (which it will be because we haven't started a game yet), then we call `beginGame()` (which calls the `useBeginGame` hook):

```js
import useBeginGame from '../hooks/use-begin-game';

const GameBoard = () => {
  const beginGame = useBeginGame();
};
```

If you don't like custom hooks, then you might not really enjoy the next few minutes of your life. This app uses 46 different custom hooks. And although I'll try my best not to go over every single one of them, because I don't really want to, I'm probably going to have to talk about hooks a bit.

A lot.

Luckily the `useBeginGame` hook is comparatively simple, so we'll start with some light pain, and it'll get worse later:

```js
// src/hooks/use-begin-game.js

import { useDispatch } from 'react-redux';

import { statusRef } from '../components/GameBoard';
import { gameBoardActions, gameOver } from '../store/game-board';

const useBeginGame = () => {
  const dispatch = useDispatch();

  const beginGame = () => {
    if (statusRef.current === gameOver) dispatch(gameBoardActions.resetGame());
    dispatch(gameBoardActions.startGame());
    dispatch(gameBoardActions.nextBlock());
  };

  return beginGame;
};

export default useBeginGame;
```

`statusRef` we've already been over, so we don't have to go over it again (thank God), then in this hook we just call three of our game board slice's actions.

`resetGame()` I'll ignore for now, because that's for when starting after a game over, _not_ when starting the first game of the session.

So we only have to concern ourselves with two actions: `startGame()` and `nextBlock()`.

By the end of this article, the game board slice will become a bit of a mess, but I'll try to build it up slowly. And the `startGame()` action is simply:

```js
// src/store/game-board.js

import { createSlice, current } from '@reduxjs/toolkit';
import arrayOfNumbers from 'array-of-numbers';

export const preGame = 'pre-game';
export const inProgress = 'in-progress';

export const dead = 'dead';
export const empty = 'empty';

export const deadRow = arrayOfNumbers().reduce(
  (acc, curr) => ((acc[curr] = { status: dead, block: '' }), acc),
  {}
);

export const emptyRow = arrayOfNumbers().reduce(
  (acc, curr) => ((acc[curr] = { status: empty, block: '' }), acc),
  {}
);

const initialSquares = () => {
  const returnObject = arrayOfNumbers(1, 20).reduce(
    (acc, curr) => ((acc[curr] = emptyRow), acc),
    {}
  );
  returnObject[0] = deadRow;
  return returnObject;
};

const initialState = {
  squares: initialSquares(),
  status: preGame,
};

const gameBoardSlice = createSlice({
  name: 'game-board',
  initialState,
  reducers: {
    startGame(state) {
      state.squares = initialState.squares;
      state.status = inProgress;
    },
  },
});

export const gameBoardActions = gameBoardSlice.actions;

export default gameBoardSlice.reducer;
```

So we hit the `startGame` action, and all we do is update `state.squares` to the initial game board, and update `state.status` to `'in-progress'`:

```js
startGame(state) {
  state.squares = initialState.squares;
  state.status = inProgress;
},
```

Not too bad, right? So simple that you're probably bored.

Well have I got a treat for you?

This is the `nextBlock()` action:

```js
nextBlock(state) {
  let newBlock = blocks[Math.floor(Math.random() * blocks.length)];

  state.liveBlock = newBlock;
  state.blockCounter = state.blockCounter + 1;

  if (state.blockCounter % 5 === 0) {
    if (state.liveBackground === 'one') {
      state.liveBackground = 'two';
      state.backgroundTwo = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    } else {
      state.liveBackground = 'one';
      state.backgroundOne = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    }
  }

  if (canAddBlock(newBlockShape(newBlock), current(state.squares))) {
    state.squares = mergeNestedObjects(current(state.squares), newBlockShape(newBlock));
    state.timer = { isLive: true };
  } else {
    if (
      !Object.keys(current(state.squares)[0])
        .map(square => current(state.squares)[0][square].status)
        .includes(settled)
    ) {
      state.squares = mergeNestedObjects(current(state.squares), {
        0: { ...newBlockShape(newBlock)[1] },
      });
    }
    state.status = gameOver;
  }
},
```

Now, I know exactly what you're thinking.

_"Kill me. Kill me now."_

And yes, at this point that would be a mercy.

But why do that, when instead you could spend the next 15 minutes of your life going over this action line-by-line with me?

I knew that would convince you to stay.

So to start with, what is

```js
let newBlock = blocks[Math.floor(Math.random() * blocks.length)];
```

Do you remember those blocks I told you about? `I`, `J`, `L`, `O`, `S`, `T` and `Z`?

Well good news, this is the `blocks` variable:

```js
export const blocks = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
```

Well what `let newBlock = blocks[Math.floor(Math.random() * blocks.length)];` does is randomly select one of these blocks, and assign it to `newBlock`.

This kind of code is crying to be made into an npm package, because God that's an ugly way of doing something so simple.

But to explain exactly what we're doing, `Math.random()` generates a float between 0 and 1 (but not including 1), for example:

```js
console.log(Math.random()); // 0.8850186784884699
```

We then multiply this by the length of our array; in this case seven (as in, seven different blocks). So

```js
Math.random() * blocks.length;
```

is equivalent to

```js
0.8850186784884699 * 7;
```

(which returns `6.1951307494` for those of you who aren't so sharp).

`Math.floor` then rounds this down to the nearest whole number, so

```js
Math.floor(Math.random() * blocks.length);
```

is equivalent to

```js
Math.floor(0.8850186784884699 * 7);
```

(which returns 6. You'd better have got that one).

`let newBlock = blocks[Math.floor(Math.random() * blocks.length)];` is therefore eqivalent to `let newBlock = blocks[6]`, except that `Math.random()` could be any float, so the effective result is that we randomly select one element from our `blocks` array, and assign it to `newBlock`.

In this example, that would be `z`.

That's the first line of this action. 29 to go.

From looking at the `startGame` action, our `initialState` was:

```js
const initialState = {
  squares: initialSquares(),
  status: preGame,
};
```

Let's add to that now:

```js
const initialState = {
  squares: initialSquares(),
  liveBlock: blocks[Math.floor(Math.random() * blocks.length)],
  blockCounter: 0,
  status: preGame,
};
```

`squares`, as we've been over earlier, is our game board.

`status` can be one of `'pre-game'`, `'in-progress'`, `'paused'` or `'game-over'`, depending on what stage of the game we're in.

Now we've just added `liveBlock`. This is the block that's currently in play, and will be one of `I`, `J`, `L`, `O`, `S`, `T` or `Z`.

`blockCounter` keeps track of how many blocks have been played in the game so far.

So onto the next lines of our `nextBlock` action:

```js
state.liveBlock = newBlock;
state.blockCounter = state.blockCounter + 1;
```

The first line simply sets the next block to be played, and the second line takes the current `blockCounter` and adds one.

_"But why do we want to know how many blocks have been played?"_ I hear you ask.

And good question. Well done.

Now strap-in, because we're about to go on an adrenaline-filled roller-coaster that is... changing the game's background.

### Backgrounds

The next part of our `nextBlock` action is:

```js
if (state.blockCounter % 5 === 0) {
  if (state.liveBackground === 'one') {
    state.liveBackground = 'two';
    state.backgroundTwo = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  } else {
    state.liveBackground = 'one';
    state.backgroundOne = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  }
}
```

Seems simple enough, right?

The first `if` statement simply checks whether or not `blockCounter` is a multiple of `5`:

```js
if (state.blockCounter % 5 === 0)
```

Then if it is... if it is... we then check if the `liveBackground` state is `one`. Wow!

Now you may be asking yourself, _"what is going on right now?"_

This wasn't how I planned for the background of this game to be, until I made a terrifying discovery:

Browsers don't allow you to transition between linear gradient backgrounds!

I know, that was my reaction too.

If you try and transition between linear gradient backgrounds, they'll just change instantly. No transition.

But I'll tell you something, I'm not about to let Google Chrome tell me what I can and can't do, so I spent an entire morning coming up with a hacky workaround that's really confusing and hard to explain.

Fight the power!

<!-- START HERE TOMORROW -->

## Useful links

<!-- TODO -->
