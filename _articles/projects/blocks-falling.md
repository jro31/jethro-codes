---
title: 'Blocks Falling'
description: 'A deep-dive into the code of this game where players must rotate falling blocks and fit them together into lines.'
coverImage: '/images/projects/blocks-falling/hero-screenshot.png'
published: '2022-05-07' # TODO - Update this
tags: 'React, Redux Toolkit, Firebase'
---

At one point in time, this app went by a different name.

I didn't really think anyone would care. Building it was a personal challenge, and another app to add to my portfolio. I didn't think more than about three people would ever play it.

Turns out some that some people do care. And they have lawyers. So I had to do a complete rebrand.

So based on this [completely unrelated video game trailer](https://youtu.be/Mr8fVT_Ds4Q) (which just so happens to be the greatest trailer in video game history), I rebranded and '[Blocks Falling](https://blocksfalling.com/)' was born.

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

`reduce` loops over all the elements of the array that it's called on. `acc` (short for 'accumulator') is the accumulated value to be returned from that iteration. `curr` (short for 'current'), is the current element from the array that we're iterating over.

Confused?

Yeah, I have that affect on people.

Let's look at a simpler example:

```js
[1, 2, 3, 4].reduce((acc, curr) => acc + curr);
```

Here, we're looping over this array. As we haven't passed-in a starting value, our `acc` starts at zero. So on the first iteration `acc` is zero, and `curr` (the first element in our array) is `1`. So `acc + curr` is equal to `0 + 1`, so we return `1`.

This value that we return, is the value of `acc` for the next iteration. So on the second iteration, `acc` is `1`, and `curr` (the second element in our array) is `2`. So `1 + 2`, we return `3` from the second iteration of our loop.

Now `acc` is `3`, and on the third iteration, `curr` is also set to `3` (the third element in our array). So on this iteration `3 + 3` returns `6`.

On the final iteration of our loop, `acc` is therefore `6`. `curr` is `4` (the last element in our array). So `6 + 4`, the above function returns `10`.

Simple enough so far, right?

Let's add one more element to our function:

```js
[1, 2, 3, 4].reduce((acc, curr) => acc + curr, 10);
```

In this example, a `10` has been added, and what this does is set the initial value of `acc`. So on our first iteration, instead of `acc` being zero, it starts as `10`. With `curr` being `1`, on our first iteration we run `10 + 1` to return `11`.

On the second iteration, `acc` is therefore set to `11`, so `11 + 2` returns `13`.

On the third iteration, `acc` is `13`, so `13 + 3` returns `16`.

On the final iteration, `acc` is `16`, so `16 + 4`, we return `20` from this function.

Now let's go back to the code that we're using to generate our game board, and look at the `emptyRow` variable:

<!-- prettier-ignore -->
```js
export const emptyRow = arrayOfNumbers().reduce((acc, curr) => ((acc[curr] = { status: empty, block: '' }), acc), {});
```

In this instance, `{}` is our initial value. On the first iteration, we're setting `acc` to an empty object.

Let me change this code slightly to make it easier to go over:

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

However, the difference is that we're setting the value of `acc[curr]` to be our `emptyRow` variable.

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

We'll touch on all parts of this state through this article. However, at this point the important thing to know is that the return from our `initialSquares()` function is set to `squares`.

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

If they're on a computer, they can press the space bar. Alternatively, if they don't have a keyboard or they just feel like living a little, they can click the on-screen play/pause button.

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

Good question. And it's just taken me half a day looking back over my commit history and my Google search history to figure it out.

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

By importing `statusRef` and then calling `statusRef.current`, it guarantees that the state that we are using is current state.

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

Assuming that `statusRef.current === preGame` is true (which it will be because we haven't started a game yet), then we call `beginGame()`, which calls the `useBeginGame` hook:

```js
import useBeginGame from '../hooks/use-begin-game';

const GameBoard = () => {
  const beginGame = useBeginGame();
};
```

If you don't like custom hooks, then you might not really enjoy the next few minutes of your life. This app uses 46 custom hooks. And although I'll try my best not to go over every single one of them, because I don't really want to, I'm probably going to have to talk about hooks a bit.

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

And what `let newBlock = blocks[Math.floor(Math.random() * blocks.length)];` does is randomly select one of these blocks, and assign it to `newBlock`.

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

In this example, that would be `'Z'`.

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

`status` can be one of `'pre-game'`, `'in-progress'`, `'paused'` or `'game-over'`, depending on what stage of the game we're as.

Now we've just added `liveBlock`. This is the block that's currently in play, and will be one of `I`, `J`, `L`, `O`, `S`, `T` or `Z`.

`blockCounter` keeps track of how many blocks have been played in the game so far.

So onto the next lines of our `nextBlock` action:

```js
state.liveBlock = newBlock;
state.blockCounter = state.blockCounter + 1;
```

The first line simply sets `state.liveBlock` as the next block to be played, and the second line takes the current `blockCounter` and adds one.

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

Now you may be asking yourself... _"what is going on right now?"_

This wasn't how I planned for the background of this game to be, until I made a terrifying discovery:

Browsers don't allow you to transition between linear gradient backgrounds!

I know, that was my reaction too.

If you try and transition between linear gradient backgrounds, they'll just change instantly. No transition.

But I'll tell you something, I'm not about to let some Google Chrome devs tell me what I can and can't do, so I spent an entire morning coming up with a hacky workaround that's really confusing and hard to explain.

Fight the power!

And to make sense of it, the first thing that we need to do is look at our styling for the `App.js` file:

```css
/* src/App.module.css */

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 0;
}

.page-container::before {
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  transition: opacity var(--transition-time);
}

.before-is-visible::before {
  opacity: 1;
}

.before-is-hidden::before {
  opacity: 0;
}

.superman,
.superman-before::before {
  background-image: linear-gradient(to right, #0099f7, #f11712);
}

.orange-coral,
.orange-coral-before::before {
  background-image: linear-gradient(to right, #ff9966, #ff5e62);
}

.deep-sea,
.deep-sea-before::before {
  background-image: linear-gradient(to right, #2c3e50, #4ca1af);
}

.sunrise,
.sunrise-before::before {
  background-image: linear-gradient(to right, #ff512f, #f09819);
}

.fresh-air,
.fresh-air-before::before {
  background-image: linear-gradient(
    95.2deg,
    rgba(173, 252, 234, 1) 26.8%,
    rgba(192, 229, 246, 1) 64%
  );
}

.cherry-blossom,
.cherry-blossom-before::before {
  background-image: linear-gradient(25deg, #d64c7f, #ee4758 50%);
}

.mango,
.mango-before::before {
  background-image: radial-gradient(circle farthest-side, #fceabb, #f8b500);
}

.chlorophyll,
.chlorophyll-before::before {
  background-image: radial-gradient(
    circle 759px at -6.7% 50%,
    rgba(80, 131, 73, 1) 0%,
    rgba(140, 209, 131, 1) 26.2%,
    rgba(178, 231, 170, 1) 50.6%,
    rgba(144, 213, 135, 1) 74.1%,
    rgba(75, 118, 69, 1) 100.3%
  );
}

.spectrum,
.spectrum-before::before {
  background-image: linear-gradient(to right, #c6ffdd, #fbd786, #f7797d);
}

.not-dead-red,
.not-dead-red-before::before {
  background-image: linear-gradient(to right, #fffbd5, #b20a2c);
}

.sand-to-sea,
.sand-to-sea-before::before {
  background-image: linear-gradient(to right, #decba4, #3e5151);
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

@media (min-width: 640px) {
  .game-container {
    flex-direction: row;
    align-items: stretch;
  }
}
```

The `--transition-time` variable is set to 10 seconds in our `index.css` file:

```css
:root {
  --transition-time: 10s;
}
```

Most of these CSS classes sound quite fun.

`cherry-blossom`, `sunrise`, `superman`, `fresh-air`... this can't be so bad, right?

Well each of these fun-sounding classes (I came up with the names myself) contain the `linear-gradients` that make-up the various backgrounds that you see while playing.

But Jethro, why do they all also have `::before` selectors?

To understand this, let's look at a simplified version of our `App.js` file:

```js
import { useSelector } from 'react-redux';

import styles from './App.module.css';

const App = () => {
  const backgroundOne = useSelector(state => state.gameBoard.backgroundOne);
  const backgroundTwo = useSelector(state => state.gameBoard.backgroundTwo);
  const liveBackground = useSelector(state => state.gameBoard.liveBackground);

  const backgroundClasses = () => {
    return `${
      liveBackground === 'one' ? styles['before-is-hidden'] : styles['before-is-visible']
    } ${styles[backgroundOne]} ${styles[`${backgroundTwo}-before`]}`;
  };

  return (
    <div className={`${styles['page-container']} ${backgroundClasses()}`}>
      {/* Some useful stuff goes here */}
    </div>
  );
};

export default App;
```

As you can see, the parent `<div>` returned from the `App.js` component has a `className` of the return of our `backgroundClasses()` function.

`backgroundClasses()` returns a string of class names.

Firstly, if `liveBackground` is equal to `'one'`, it returns the `'before-is-hidden'` class. If `liveBackground` is not equal to `one`, it returns the `'before-is-visible'` class.

If it helps you to understand, 'before' is a noun rather than a preposition in these class names.

No?

Worth a shot.

Let's go back to our stylesheet again:

```css
.page-container::before {
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  transition: opacity var(--transition-time);
}

.before-is-visible::before {
  opacity: 1;
}

.before-is-hidden::before {
  opacity: 0;
}
```

Our `<div>` has a `::before` pseudo-element. This element is positioned absolutely with the `top`, `right`, `bottom` and `left` properties all set to `0`. This means that this pseudo-element takes up the entire screen.

It also has a `z-index` of `1`.

By virtue of the elements contained within it, this `<div>` also takes-up the entire screen. However, thanks to the `.page-container` class, it has a `z-index` of `0`.

```css
.page-container {
  z-index: 0;
}
```

What does all this mean?

It means that the `page-container::before` pseudo-element is exactly the same size and in the same position as the `page-container` element, however it sits on top of it.

We cannot transition linear-gradient backgrounds. However what we can do, is transition the `opacity` of the `page-container::before` element.

If the `'before-is-visible'` class is returned from the `backgroundClasses()` function, then the `page-container::before` pseudo-element is visible. If `'before-is-hidden'` is returned from `backgroundClasses()` then `page-container::before` is transparent.

And as we have a `transition: opacity var(--transition-time);` property on `.page-container::before`, this change between opacity takes 10 seconds, giving the illusion that the linear-gradient background is changing gradually:

```css
.page-container::before {
  transition: opacity var(--transition-time);
}

.before-is-visible::before {
  opacity: 1;
}

.before-is-hidden::before {
  opacity: 0;
}
```

So when you play the game, and you see the background slowly changing, that's not actually what's happening at all. What is actually happening, is the `page-container::before` pseudo-element that lives on top of the background (but beneath the game board) is changing its opacity.

Let's again look at the code from our `nextBlock()` action:

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

Our `liveBackground` state can be one of two values: `one` or `two`. And when every fifth block is added to the game (`if (state.blockCounter % 5 === 0) {`), it will toggle to the value that it isn't currently.

So if it's `one`, then it'll change to `two`, and if it's `two`, it'll change to `one`.

If you remember back to our `backgroundClasses()` function in `App.js`, this change in `liveBackground` is what determines whether our `<div>` has a `'before-is-hidden'` or a `'before-is-visible'` class:

<!-- prettier-ignore -->
```js
const backgroundClasses = () => {
  return `${
    liveBackground === 'one' ? styles['before-is-hidden'] : styles['before-is-visible']
  } ${styles[backgroundOne]} ${styles[`${backgroundTwo}-before`]}`;
};
```

So as `liveBackground` changes from `one` to `two` (or vice-versa) with every fifth block, the `'before-is-hidden'` and `'before-is-visible'` classes also toggle with every fifth block.

And that means that every fifth block, `.page-container::before` has an `opacity` of `1`, then an `opacity` of `0`, then an `opacity` of `1`, then an `opacity` of `0` etc.

```css
.before-is-visible::before {
  opacity: 1;
}

.before-is-hidden::before {
  opacity: 0;
}
```

Let's add a little more to the `initialState` of our game board slice now:

```js
const backgrounds = [
  'superman',
  'orange-coral',
  'deep-sea',
  'sunrise',
  'fresh-air',
  'cherry-blossom',
  'mango',
  'chlorophyll',
  'spectrum',
  'not-dead-red',
  'sand-to-sea',
];

const initialState = {
  squares: initialSquares(),
  liveBlock: randomElement(blocks),
  blockCounter: 0,
  status: preGame,
  backgroundOne: backgrounds[Math.floor(Math.random() * backgrounds.length)],
  backgroundTwo: backgrounds[Math.floor(Math.random() * backgrounds.length)],
  liveBackground: 'one',
};
```

We've just added the `backgroundOne`, `backgroundTwo` and `liveBackground` states.

You'll also see that the `backgrounds` array _matches_ the class names of the various backgrounds in our CSS file.

So in our `initialState`, for when we load the page and start the game, `backgroundOne` will be randomly set to one of these background strings, and `backgroundTwo` will be randomly set to one of these background strings.

For this example, let's say that the `initialState` is:

```js
const initialState = {
  backgroundOne: 'superman',
  backgroundTwo: 'cherry-blossom',
  liveBackground: 'one',
};
```

How would this affect our `backgroundClasses()` function?

<!-- prettier-ignore -->
```js
const backgroundClasses = () => {
  return `${
    liveBackground === 'one' ? styles['before-is-hidden'] : styles['before-is-visible']
  } ${styles[backgroundOne]} ${styles[`${backgroundTwo}-before`]}`;
};
```

Well `liveBackground` is currently `'one'`, so we're returning the `'before-is-hidden'` class. Then `backgroundOne` is `'superman'`, so we're returning the `'superman'` class. And `backgroundTwo` is `'cherry-blossom'` so we're returning the `'cherry-blossom-before'` class.

Therefore, for this example, `backgroundClasses()` is equivalent to

```js
const backgroundClasses = () => {
  return {`${styles['before-is-hidden']} ${styles['superman']} ${styles['cherry-blossom-before']}`}
};
```

So our

<!-- prettier-ignore -->
```js
<div className={`${styles['page-container']} ${backgroundClasses()}`}>
  {/* Fun stuff here */}
</div>
```

`<div>` becomes

<!-- prettier-ignore -->
```js
<div className={`${styles['page-container']} ${styles['before-is-hidden']} ${styles['superman']} ${styles['cherry-blossom-before']}`}>
  {/* Fun stuff here */}
</div>
```

And if we go back to our stylesheet, what that means is:

```css
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 0;
}

.page-container::before {
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  transition: opacity var(--transition-time);
}

.before-is-hidden::before {
  opacity: 0;
}

.superman {
  background-image: linear-gradient(to right, #0099f7, #f11712);
}

.cherry-blossom-before::before {
  background-image: linear-gradient(25deg, #d64c7f, #ee4758 50%);
}
```

Currently our `::before` pseudo-element has an `opacity` of `0`, so is completely transparent. And as we can't see this pseudo-element, it means that we _can_ see the `<div>`, which has the `.superman` class, and so we display the 'superman' background:

![Superman](/images/projects/blocks-falling/superman.png)
_Superman_

We then start playing the game, and we reach our fifth block:

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

As `state.liveBackground` is currenly `'one'`, we update this to `'two'`, and we change `state.backgroundTwo` to a new random background.

So we never got to see cherry blossom. God dammit!

Let's say that `state.backgroundTwo` updates to `'sunrise'`.

As these two states update, our `App.js` component re-renders, meaning that our `<div>` calls the `backgroundClasses()` function again.

<!-- prettier-ignore -->
```js
const backgroundClasses = () => {
  return `${
    liveBackground === 'one' ? styles['before-is-hidden'] : styles['before-is-visible']
  } ${styles[backgroundOne]} ${styles[`${backgroundTwo}-before`]}`;
};
```

`liveBackground` is now `'two'`, `backgroundOne` is still `'superman'`, and `backgroundTwo` is now `'sunrise'`, so the return from `backgroundClasses()` is

```js
const backgroundClasses = () => {
  return {`${styles['before-is-visible']} ${styles['superman']} ${styles['sunrise-before']}`}
};
```

meaning that our `<div>` becomes:

<!-- prettier-ignore -->
```js
<div className={`${styles['page-container']} ${styles['before-is-visible']} ${styles['superman']} ${styles['sunrise-before']}`}>
  {/* Fun stuff here */}
</div>
```

In our stylesheet, that means

```css
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 0;
}

.page-container::before {
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  transition: opacity var(--transition-time);
}

.before-is-visible::before {
  opacity: 1;
}

.superman {
  background-image: linear-gradient(to right, #0099f7, #f11712);
}

.sunrise-before::before {
  background-image: linear-gradient(to right, #ff512f, #f09819);
}
```

The key part here, is `before-is-visible`. This gives our `::before` pseudo-element an `opacity` of `1`, so it becomes completely opaque. That means that we're now showing our `.sunrise-before::before` background, and our `.superman` background behind it, completely hidden.

However, as we have a transition on `opacity`, this change happens gradually over the next 10 seconds.

```css
.page-container::before {
  transition: opacity var(--transition-time);
}
```

This gives the illusion that we've gradually transitioned between our linear-gradient backgrounds, where as actually we've just changed the `opacity` of the `::before` pseudo-element.

![Sunrise](/images/projects/blocks-falling/sunrise.png)
_Sunrise_

So we keep on playing, and get to our 10th block.

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

As we get here, our `liveBackground` state is `'two'`, so the first thing that we do is change this back to `'one'`. Then randomly select a new background class, and set this to our `backgroundOne` state.

For this example, let's say that `state.backgroundOne` now becomes `'mango'`.

Because of these changes, our `App.js` component re-renders, meaning that it calls `backgroundClasses()` again.

<!-- prettier-ignore -->
```js
const backgroundClasses = () => {
  return `${
    liveBackground === 'one' ? styles['before-is-hidden'] : styles['before-is-visible']
  } ${styles[backgroundOne]} ${styles[`${backgroundTwo}-before`]}`;
};
```

And this time, as `liveBackground` is equal to `'one'` again, we return our `'before-is-hidden'` class here. `backgroundOne` is now `'mango'`, and `backgroundTwo` is still `'sunrise'`, so `backgroundClasses()` returns:

```js
const backgroundClasses = () => {
  return {`${styles['before-is-hidden']} ${styles['mango']} ${styles['sunrise-before']}`}
};
```

meaning that our `<div>` becomes:

<!-- prettier-ignore -->
```js
<div className={`${styles['page-container']} ${styles['before-is-hidden']} ${styles['mango']} ${styles['sunrise-before']}`}>
  {/* Kung fu */}
</div>
```

The relevant classes in our stylesheet are:

```css
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 0;
}

.page-container::before {
  position: absolute;
  content: '';
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  transition: opacity var(--transition-time);
}

.before-is-hidden::before {
  opacity: 0;
}

.mango {
  background-image: radial-gradient(circle farthest-side, #fceabb, #f8b500);
}

.sunrise-before::before {
  background-image: linear-gradient(to right, #ff512f, #f09819);
}
```

Our `::before` pseudo-element is now opaque again, so we can no longer see our `.sunrise` background, with the exception that the transition to this `opacity` takes ten seconds, again giving the illusion of the linear-gradient background transitioning slowly, until we can only see `.mango`.

[ADD MANGO SCREENSHOT HERE, TAKEN ON BIG MONITOR]

And that's how I hacked my way around the restriction of being able to transition linear gradients.

Now let's continue down our `nextBlock()` action:

```js
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
```

This last step of our action, starts by calling `canAddBlock()` as a way of checking _if_ we can add a new block to our game board.

<!-- prettier-ignore -->
```js
const canAddBlock = (nextBlock, currentGrid) => {
  if (Object.keys(currentGrid[0]).map(square => currentGrid[0][square].status).includes(settled)) return false
  if (Object.keys(nextBlock[1]).map(square => currentGrid[1][square].status).includes(settled)) return false
  return true
};
```

Obviously, as we're just starting the game, we should return `true` here. This check becomes more relevant later in the game when we need to know whether we can add another block, or whether the user has stacked their blocks to the top of the game board and it's time for 'Game Over'. But seeing as we're here already, let's go over this logic now.

So our call to `canAddBlock()` passes in two arguments:

```js
canAddBlock(newBlockShape(newBlock), current(state.squares));
```

If you remember back at the beginning of the `nextBlock()` action, the `newBlock` variable was randomly assigned the name of one of our blocks; one of `I`, `J`, `L`, `O`, `S`, `T` or `Z`:

```js
export const blocks = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

let newBlock = blocks[Math.floor(Math.random() * blocks.length)];
```

So the first argument that we pass-into `canAddBlock()` is the return of `newBlockShape(newBlock)`:

```js
export const live = 'live';

export const iBlock = 'i-block';
export const jBlock = 'j-block';
export const lBlock = 'l-block';
export const oBlock = 'o-block';
export const sBlock = 's-block';
export const tBlock = 't-block';
export const zBlock = 'z-block';

const blockObject = block => {
  return {
    status: live,
    block: block,
  };
};

const newBlockShape = block => {
  switch (block) {
    case 'I':
      return newBlockI();
    case 'J':
      return newBlockJ();
    case 'L':
      return newBlockL();
    case 'O':
      return newBlockO();
    case 'S':
      return newBlockS();
    case 'T':
      return newBlockT();
    case 'Z':
      return newBlockZ();
    default:
      return newBlockO();
  }
};

const newBlockI = () => {
  const blockI = blockObject(iBlock);

  return {
    1: {
      4: blockI,
      5: blockI,
      6: blockI,
      7: blockI,
    },
  };
};

const newBlockJ = () => {
  const blockJ = blockObject(jBlock);

  return {
    0: {
      4: blockJ,
    },
    1: {
      4: blockJ,
      5: blockJ,
      6: blockJ,
    },
  };
};

const newBlockL = () => {
  const blockL = blockObject(lBlock);

  return {
    0: {
      6: blockL,
    },
    1: {
      4: blockL,
      5: blockL,
      6: blockL,
    },
  };
};

const newBlockO = () => {
  const blockO = blockObject(oBlock);

  return {
    0: {
      5: blockO,
      6: blockO,
    },
    1: {
      5: blockO,
      6: blockO,
    },
  };
};

const newBlockS = () => {
  const blockS = blockObject(sBlock);

  return {
    0: {
      5: blockS,
      6: blockS,
    },
    1: {
      4: blockS,
      5: blockS,
    },
  };
};

const newBlockT = () => {
  const blockT = blockObject(tBlock);

  return {
    0: {
      5: blockT,
    },
    1: {
      4: blockT,
      5: blockT,
      6: blockT,
    },
  };
};

const newBlockZ = () => {
  const blockZ = blockObject(zBlock);

  return {
    0: {
      4: blockZ,
      5: blockZ,
    },
    1: {
      5: blockZ,
      6: blockZ,
    },
  };
};
```

Ok man, what the Hell?

Let's break this down to make it a little clearer.

Firstly, let's say that our `newBlock` variable was assigned a value of `'J'`. Then when we call `newBlockShape(newBlock)` we're passing-in the argument of `'J'`, so the equivalent of:

```js
newBlockShape('J');
```

The relevant parts of the `newBlockShape()` function then become:

```js
const newBlockShape = block => {
  switch (block) {
    case 'J':
      return newBlockJ();
  }
};
```

So what we return from `newBlockShape()` is the return of the `newBlockJ()` function:

```js
export const live = 'live';

export const jBlock = 'j-block';

const blockObject = block => {
  return {
    status: live,
    block: block,
  };
};

const newBlockJ = () => {
  const blockJ = blockObject(jBlock);

  return {
    0: {
      4: blockJ,
    },
    1: {
      4: blockJ,
      5: blockJ,
      6: blockJ,
    },
  };
};
```

The `jBlock` variable is simply the string `'j-block'`, and the `live` variable is simply the string `'live'`, I just assign them to variables to prevent typos, because if you mis-type the variable name, it will throw an error.

The return from `blockObject()` is an object (surprisingly). This is the object that's going to be nested into one of the squares of our game board (did it look familiar?).

Previously, in our `initialState`, the status of all our squares had been set to `'empty'` or `'dead'`, but now as we're adding a block, it's going to become `'live'`.

So in this instance, where the new block that we randomly selected was `'J'`, the return from `blockObject()` is going to be:

```js
{
  status: 'live',
  block: 'j-block',
}
```

In our `newBlockJ` function, we assign this return to the variable `blockJ`, then from this function return _another_ object formed as such:

```js
return {
  0: {
    4: blockJ,
  },
  1: {
    4: blockJ,
    5: blockJ,
    6: blockJ,
  },
};
```

You may be looking at this and thinking _"why am I still reading this article?"_

It's not as stupid as it looks though.

Remember that the block that we want is a 'J' shape. On its side. So:

![j-block](/images/projects/blocks-falling/j-block.jpeg)

And you may also remember that within our game board, the keys of the first object represent rows, and the keys of the objects within these represent squares.

Well... here's where all that starts to matter.

What we're returning here, are the squares in our gameboard that we need to update in order to simulate adding the `J` block.

So from the above code, in row `0` (the top/dead row), what we want to do is change square `4` (the fourth square from the left), from its initial value of

```js
{
  'status': 'empty',
  'block': ''
}
```

to its new value of

```js
{
  status: 'live',
  block: 'j-block',
}
```

And in the row below, with the key `1`, we want to change the squares `4`, `5` and `6` from their initial value of

```js
{
  'status': 'empty',
  'block': ''
}
```

to their new values of

```js
{
  status: 'live',
  block: 'j-block',
}
```

Therefore, the return from the `newBlockJ()` function, and consequently the return from the `newBlockShape()` function (when passing-in `'J'` as the argument), will be this object

```js
return {
  0: {
    4: blockJ,
  },
  1: {
    4: blockJ,
    5: blockJ,
    6: blockJ,
  },
};
```

which is equivalent to

```js
return {
  0: {
    4: {
      status: 'live',
      block: 'j-block',
    },
  },
  1: {
    4: {
      status: 'live',
      block: 'j-block',
    }
    5: {
      status: 'live',
      block: 'j-block',
    }
    6: {
      status: 'live',
      block: 'j-block',
    }
  },
};
```

If you remember our `if` check from what feels like a lifetime ago now, this return is passed-in as the first argument to the `canAddBlock()` function:

```js
if (canAddBlock(newBlockShape(newBlock), current(state.squares))) {
```

The second argument is thankfully a little simpler to explain.

`current` is given to use by Redux Toolkit, and we import it at the top of our game board slice:

```js
import { current } from '@reduxjs/toolkit';
```

It allows us to use our 'current' state. In this case, `current(state.squares)` is equivalent to our current game board.

So to `canAddBlock()`, we're passing-in `newBlockShape(newBlock)`, which is an object representing the changes that we want to make to our game board, and our current game board.

Back to our `canAddBlock()` function:

<!-- prettier-ignore -->
```js
const canAddBlock = (nextBlock, currentGrid) => {
  if (Object.keys(currentGrid[0]).map(square => currentGrid[0][square].status).includes(settled)) return false
  if (Object.keys(nextBlock[1]).map(square => currentGrid[1][square].status).includes(settled)) return false
  return true
};
```

Now that we know what the two arguments we're passing-in represent, it's a little easier to make sense of what's going on here.

`currentGrid` is our current game board, so in the first `if` check, we run `Object.keys(currentGrid[0])`. This simple returns us the keys from the top row of our game board.

These keys are the same on all rows of the game board, and will almost certainly never change, so we could instead just replace `Object.keys(currentGrid[0])` with `['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']` and it would work just the same way. But just in case I one day, in my infinite wisdom decide... I think the game board needs to have 11 columns, then we're fetching the keys for the top row programatically, so it won't cause any issue.

We then take this array of keys and map over it, so

```js
Object.keys(currentGrid[0]).map(square => currentGrid[0][square].status);
```

is equivalent to

```js
['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(square => currentGrid[0][square].status);
```

`currentGrid[0]` just means the top row of our game board, so by mapping over the keys `'1'` to `'10'`, what we return here, is an array of the `status` of all ten squares of our top row.

For the game to continue, there can be no blocks "settled" in this top/dead row, so what we would expect this array to be most of the time would be:

```js
['dead', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead'];
```

The last part of our `if` statement checks if this array includes `settled` (the `settled` variable is just the string `'settled'`).

So assuming that there are no blocks "settled" in this top row, then

```js
if (Object.keys(currentGrid[0]).map(square => currentGrid[0][square].status).includes(settled))
```

is equivalent to

```js
if (['dead', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead'].includes('settled'))
```

which will return `false` (as the array does not include the element `'settled'`).

And because this `if` check returns `false`, then we do **not** return `false` from the `canAddBlock()` function after this check:

<!-- prettier-ignore -->
```js
if (Object.keys(currentGrid[0]).map(square => currentGrid[0][square].status).includes(settled)) return false
```

_If_ however, the `if` check returned `true`, for example

<!-- prettier-ignore -->
```js
if (['dead', 'dead', 'dead', 'settled', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead'].includes('settled')) return false
```

then we would return `false` from the `canAddBlock()` function, meaning that we **cannot** add a new block.

For now though, let's assume that the `if` check returns `false`, in which case we move onto the second line of the `canAddBlock()` function:

<!-- prettier-ignore -->
```js
if (Object.keys(nextBlock[1]).map(square => currentGrid[1][square].status).includes(settled)) return false
```

We're again using `Object.keys`, but this time on our `nextBlock` argument. And if you remember, this argument is the object that represents our new block. On the assumption that it's a `'J'` block, then it would be:

```js
{
  0: {
    4: {
      status: 'live',
      block: 'j-block',
    },
  },
  1: {
    4: {
      status: 'live',
      block: 'j-block',
    }
    5: {
      status: 'live',
      block: 'j-block',
    }
    6: {
      status: 'live',
      block: 'j-block',
    }
  },
};
```

So `Object.keys(nextBlock[1])` returns an array of the keys within row `1`, which in this case is `['4', '5', '6']`. So in our `if` statement,

```js
Object.keys(nextBlock[1]).map(square => currentGrid[1][square].status);
```

is equivalent to

```js
['4', '5', '6'].map(square => currentGrid[1][square].status);
```

As these keys represent that our new block wants to join our game board at squares `4`, `5` and `6` on row `1`, we then need to check whether these squares are currently available.

So `currentGrid[1]` returns row `1` of our current game board. `[square]` represents the squares needed by our new block (`4`, `5` and `6`). So what we return from our map function, is an array of the `status` of all the squares on row `1` of our current game board, that we need for our new block.

In most instances this will be something like `['empty', 'empty', 'empty']` (although the length of the array will change, depending on which block we want to add to our game board).

And if you go back to the full `if` statement

<!-- prettier-ignore -->
```js
if (Object.keys(nextBlock[1]).map(square => currentGrid[1][square].status).includes(settled)) return false
```

is therefore equivalent to, for example:

```js
if (['empty', 'empty', 'empty'].includes('settled')) return false;
```

In this instance, our `if` statement returns `false`, so we do **not** return false from our `canAddBlock()`.

If on the other hand, there _is_ a block that's "settled" in one of the squares that we need for our new block, our `if` statement would instead be something like:

```js
if (['empty', 'empty', 'settled'].includes('settled')) return false;
```

In this instance, our `if` statement returns `true`, so we return `false` from our `canAddBlock()` function.

Now if we go back to our full `canAddBlock()` function:

<!-- prettier-ignore -->
```js
const canAddBlock = (nextBlock, currentGrid) => {
  if (Object.keys(currentGrid[0]).map(square => currentGrid[0][square].status).includes(settled)) return false
  if (Object.keys(nextBlock[1]).map(square => currentGrid[1][square].status).includes(settled)) return false
  return true
};
```

If the two `if` statements that we've been over return `false`, which means that there are no blocks "settled" in our 'dead' row, and there are no blocks "settled" in the squares that we need to add our new block, then we return `true` from this function, meaning that we _can_ add the new block to our game board.

And going back to this part of our `nextBlock()` action, let's take a look at what happens when `canAddBlock()` is `true`, and when `canAddBlock()` is `false`:

```js
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
```

Starting with `true`, the first thing we do is update `state.squares` to the return of the `mergeNestedObjects()` function:

```js
state.squares = mergeNestedObjects(current(state.squares), newBlockShape(newBlock));
```

And thankfully, we've already been over the two arguments we're passing-in here. We know that `current(state.squares)` is our current game board, and `newBlockShape(newBlock)` is the new block that we want to add to our game board.

In `mergeNestedObjects()`, these arguments are renamed to `existingObject` and `newObject`:

```js
const mergeNestedObjects = (existingObject, newObject) => {
  let returnObject = { ...existingObject };

  Object.keys(newObject).forEach(outerKey =>
    Object.keys(newObject[outerKey]).forEach(
      innerKey =>
        (returnObject = {
          ...returnObject,
          [outerKey]: { ...returnObject[outerKey], [innerKey]: newObject[outerKey][innerKey] },
        })
    )
  );

  return returnObject;
};
```

## Useful links

<!-- TODO -->
