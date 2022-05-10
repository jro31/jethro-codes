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

However, my motivation for building this app was two-fold.

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

In this instance, `{}` is our initial value, so on the first iteration `acc` is set to an empty object.

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

In order for the square to know what color it needs to be, the value of `block` (if the square is not `empty` or `dead`) will be one of seven block names.

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

Ruining the illusion of actually playing a fun video game, it simply means that we update the `status` and `block` values of the relevant 'squares' within our game board to be `'live'` and the name of the block respectively.

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

Good question, and it's just taken me half a day looking back over my commit history and my Google search history to figure it out.

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

When we call `setTimeout()` here, we set it to call `moveBlock(down)` _after_ the `speed` interval; so anything up to one second into the future.

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

That means that it doesn't matter that we called our `useMoveBlock` hook up to a second ago, because by importing `squaresRef` and calling `squaresRef.current`, we can guarantee that we are working with the latest version of the game board.

It's the same with:

```js
const status = useSelector(state => state.gameBoard.status);
statusRef = useRef(status);
statusRef.current = status;
```

By importing `statusRef` and then calling `statusRef.current`, it guarantees that the state that we are using is the current state.

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

`resetGame()` I'll ignore for now, because that's for when starting after a game over, _not_ when starting a game for the first time.

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

And yes, at this point that would be a mercy. But why do that, when instead you could spend the next 15 minutes of your life going over this action line-by-line with me?

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

`status` can be one of `'pre-game'`, `'in-progress'`, `'paused'` or `'game-over'`, depending on what stage of the game we're at.

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

Now you may be asking yourself... _"what's going on right now?"_

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

Our `<div>` has a `::before` pseudo-element. This pseudo-element is positioned absolutely with the `top`, `right`, `bottom` and `left` properties all set to `0`. That means that this pseudo-element takes up the entire screen.

It also has a `z-index` of `1`.

By virtue of the elements contained within it, this `<div>` also takes-up the entire screen. However, thanks to the `.page-container` class, it has a `z-index` of `0`.

```css
.page-container {
  z-index: 0;
}
```

What does all this mean?

It means that the `<div>`'s `::before` pseudo-element is exactly the same size and in the same position as the `<div>` element itself, however it sits on top of it.

We cannot transition linear-gradient backgrounds. However what we can do, is transition the `opacity` of this `::before` pseudo-element.

If the `'before-is-visible'` class is returned from the `backgroundClasses()` function, then the `::before` pseudo-element is visible. If `'before-is-hidden'` is returned from `backgroundClasses()` then the `::before` pseudo-element is transparent.

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

So when you play the game, and you see the background slowly changing, that's not actually what's happening at all. What is actually happening, is the `::before` pseudo-element that lives on top of the background (but beneath the game board) is changing its opacity.

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

Our `liveBackground` state can be one of two values: `'one'` or `'two'`. And when every fifth block is added to the game (`if (state.blockCounter % 5 === 0) {`), it will toggle to the value that it isn't currently.

So if it's `'one'`, then it'll change to `'two'`, and if it's `'two'`, it'll change to `'one'`.

If you remember back to our `backgroundClasses()` function in `App.js`, this change in `liveBackground` is what determines whether our `<div>` has the `'before-is-hidden'` or the `'before-is-visible'` class:

<!-- prettier-ignore -->
```js
const backgroundClasses = () => {
  return `${
    liveBackground === 'one' ? styles['before-is-hidden'] : styles['before-is-visible']
  } ${styles[backgroundOne]} ${styles[`${backgroundTwo}-before`]}`;
};
```

So as `liveBackground` changes from `one` to `two` (or vice-versa) with every fifth block, the `'before-is-hidden'` and `'before-is-visible'` classes also toggle with every fifth block.

And that means that every fifth block, our `::before` pseudo-element has an `opacity` of `1`, then an `opacity` of `0`, then an `opacity` of `1`, then an `opacity` of `0` etc.

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

The key part here, is `before-is-visible`. This gives our `::before` pseudo-element an `opacity` of `1`, so it becomes completely opaque. That means that we're now showing our `.sunrise-before::before` background, and our `.superman` background is behind it, completely hidden.

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

As we get here, our `liveBackground` state is `'two'`, so the first thing that we do is change this back to `'one'`. Then we randomly select a new background class, and set this to our `backgroundOne` state.

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

Our `::before` pseudo-element is now transparent again, so we can no longer see our `.sunrise` background, with the exception that the transition to this `opacity` takes ten seconds, again giving the illusion of the linear-gradient background transitioning slowly, until we can only see `.mango`.

![Mango](/images/projects/blocks-falling/mango.png)
_Mango_

And that's how I hacked my way around the restriction of being able to transition linear gradients.

### Adding a new block

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

This last step of our action starts by calling `canAddBlock()` as a way of checking _if_ we can add a new block to our game board.

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

Previously, in our `initialState`, the status of all our squares had been set to `'empty'` or `'dead'`, but now as we're adding a block, we're also going to add `'live'`.

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

Remember that the block that we want is a 'J' shape (on its side). So:

![j-block](/images/projects/blocks-falling/j-block.jpeg)

And you may also remember that within our game board, the keys of the first object represent rows, and the keys of the objects within these represent squares.

Well... here's where all that starts to matter.

What we're returning here, are the squares in our gameboard that we need to update in order to add the `J` block.

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

And in the row below, with the key `1`, we want to change the squares `4`, `5` and `6` from their initial values of

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

`current` is given to us by Redux Toolkit, and we import it at the top of our game board slice:

```js
import { current } from '@reduxjs/toolkit';
```

It allows us to use our 'current' state. In this case, `current(state.squares)` is equivalent to our current game board.

So to `canAddBlock()`, we're passing-in `newBlockShape(newBlock)`, which is an object representing the changes that we want to make to our game board, and we're passing-in our current game board.

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

`currentGrid` is our current game board, so in the first `if` check, we run `Object.keys(currentGrid[0])`. This simply returns us the keys from the top row of our game board.

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

So `currentGrid[1]` returns row `1` of our current game board. `[square]` represents the squares needed by our new block (`4`, `5` and `6`). So what we return from our map function, is an array of the `status` of the squares on row `1` of our current game board, that we need for our new block.

In most instances this will be something like `['empty', 'empty', 'empty']` (although the length of the array will change depending on which block we want to add to our game board).

If we go back to our full `if` statement

<!-- prettier-ignore -->
```js
if (Object.keys(nextBlock[1]).map(square => currentGrid[1][square].status).includes(settled)) return false
```

is therefore equivalent to, for example:

```js
if (['empty', 'empty', 'empty'].includes('settled')) return false;
```

In this instance, our `if` statement returns `false`, so we do **not** return false from `canAddBlock()`.

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

  Object.keys(newObject).forEach(rowKey =>
    Object.keys(newObject[rowKey]).forEach(
      columnKey =>
        (returnObject = {
          ...returnObject,
          [rowKey]: { ...returnObject[rowKey], [columnKey]: newObject[rowKey][columnKey] },
        })
    )
  );

  return returnObject;
};
```

The `returnObject` variable is what we ultimately return from this function, and what we update `state.squares` (our game board) to be. So the first thing that we do is set `returnObject` to be equivalent to our current game board:

```js
let returnObject = { ...existingObject };
```

So now we have our current game board set to `returnObject`, and we know that we're able to add our new block, we just need to update `returnObject` to include our new block.

Let's continue with the assumption that we're adding a `J` block. That means that `newObject` is equal to:

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

So when we run `Object.keys(newObject)`, we get `['0', '1']`.

We run a `forEach` loop over these values, giving them the name `rowKey`, as they represent the rows in our game board:

```js
Object.keys(newObject).forEach(rowKey =>
```

Within each iteration of this loop, we then fetch the child keys of each row with `Object.keys(newObject[rowKey])`. Each of these child keys represents the square, or column within that row that we want to update.

Continuing our example of the `J` block, `Object.keys(newObject[rowKey])` where `rowKey` is `0` would return `['4']`, and `Object.keys(newObject[rowKey])` where `rowKey` is `1`, would return `['4', '5', '6']`.

We then do a `forEach` loop over each of these values, so we're not in a bit of a loopception. And in this instance, I gave the keys the name `columnKey`.

```js
Object.keys(newObject[rowKey]).forEach(columnKey =>
```

By looping over our rows, and then the squares/columns within these rows, what we're doing is having one iteration within our loops, for _each_ of the squares that we want to update.

Then it's simply a case of updating our `returnObject` appropriately:

```js
returnObject = {
  ...returnObject,
  [rowKey]: { ...returnObject[rowKey], [columnKey]: newObject[rowKey][columnKey] },
};
```

`...returnObject` simply copies our existing return object.

Then with `[rowKey]:` we update the relevant row of our game board.

`...returnObject[rowKey]` copies the row as it currently exists, then `[columnKey]: newObject[rowKey][columnKey]` updates the corresponding column with the value of the equivalent column from `newObject`.

To make it clearer, let's go over the first iteration of our loop.

The first value of `Object.keys(newObject)` is `'0'`, so from

```js
Object.keys(newObject).forEach(rowKey =>
```

our `rowKey` is `'0'`.

That means that

```js
Object.keys(newObject[rowKey]).forEach(columnKey =>
```

is equivalent to

```js
Object.keys(newObject['0']).forEach(columnKey =>
```

If you remember, our `newObject` only has one key within the `0` row:

```js
{
  0: {
    4: {
      status: 'live',
      block: 'j-block',
    },
  },
  1: {
    // More stuff here
  },
};
```

That means that on this first iteration, `columnKey` will be `'4'`.

So then we get into this code:

```js
returnObject = {
  ...returnObject,
  [rowKey]: { ...returnObject[rowKey], [columnKey]: newObject[rowKey][columnKey] },
};
```

As we know that `rowKey` is `'0'` and `columnKey` is `'4'`, then this code can be updated to:

```js
returnObject = {
  ...returnObject,
  ['0']: { ...returnObject['0'], ['4']: newObject['0']['4'] },
};
```

`...returnObject` copies our existing `returnObject` variable, then the `['0']` overwrites this _just_ for row `0`. Although the first thing we do here, is copy all of the existing row `0`:

```js
...returnObject['0']
```

The only column that we return that is _different_ from how `returnObject` started, is column `4` on row `0`:

```js
['4']: newObject['0']['4']
```

This column we update to instead be the value of row `0`, column `4` of our `newObject` variable. In this instance, that would be:

```js
{
  status: 'live',
  block: 'j-block',
}
```

We then continue our iterations over the other rows/squares that we want to update, until we've updated everything we want to update on our game board.

Assuming that we're starting a new game, the top two rows of our `returnObject` would have started as:

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
  // etc.
}
```

What we would then return from this `mergeNestedObjects()` function, would be:

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
      'status': 'live',
      'block': 'j-block'
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
      'status': 'live',
      'block': 'j-block'
    },
    '5': {
      'status': 'live',
      'block': 'j-block'
    },
    '6': {
      'status': 'live',
      'block': 'j-block'
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
}
```

And if you think back to what we're doing with this return in our `nextBlock()` action, this is what we're updating `state.squares` to be:

```js
state.squares = mergeNestedObjects(current(state.squares), newBlockShape(newBlock));
```

So what we return from `mergeNestedObjects()` _becomes_ our new game board.

The other state we update if `canAddBlock()` returns `true`, is `state.timer`:

```js
if (canAddBlock(newBlockShape(newBlock), current(state.squares))) {
  state.squares = mergeNestedObjects(current(state.squares), newBlockShape(newBlock));
  state.timer = { isLive: true };
}
```

This is an object that contains just the `isLive` key. It will always be `{ isLive: true }` or `{ isLive: false }`, and it is used in our `GameBoard` component.

```js
import { useSelector } from 'react-redux';

const GameBoard = () => {
  const timer = useSelector(state => state.gameBoard.timer);

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

We've seen this code already, but let me just go over exactly what the `timer` state is doing here.

And first it's necessary to understand _why_ we need to know if the time is `live` or not.

In this `useEffect` block, we're calling `setTimeout`, and then after the interval determined by `speed`, we call our `moveBlock(down)` hook.

The problem with this, is that we don't _always_ want to call `moveBlock(down)` when the interval determined by `speed` reaches zero.

The most obvious example is if the user has paused the game, we certainly don't want to still move the block down. But also, what if the user has manually moved the block down?

If `speed` was set to 1 second, but the user has moved the block down with the down arrow after 0.9 seconds, do we still want to move the block down 0.1 second later?

No. In this case we want to reset the timer to 1 second again. That's what's happening in this `useEffect` function.

It has two dependencies:

```js
[status, timer];
```

It also has a clean-up function:

```js
return () => {
  clearTimeout(timeOut);
};
```

Anytime that either of the dependencies change, the clean-up function is run, before the `useEffect` block is run again.

And in this clean-up function, `clearTimeout(timeOut)` "clears" our timer, meaning that `moveBlock(down)` _won't_ be called.

Did you wonder a minute ago why `state.timer` is always either `{ isLive: true }` or `{ isLive: false }`, and not just `true` or `false`?

It could instead have been renamed to something clearer, and just had the values of `true` or `false`.

The problem with that, is if `state.timer` is `true`, and in my game board slice, I call `state.timer = true`, then what changed?

Well... nothing. That's the problem.

According to React, `state.timer` did not just update.

Remember that these are the dependencies of our `useEffect` function:

```js
[status, timer];
```

If React doesn't consider that `timer` just updated, then it _won't_ call our clean-up function which clears the timer, and it _won't_ re-run our `useEffect` function.

This is bad, because we've just added a new block. We _want_ the timer to be reset here.

Contrary to this, if `state.timer` is `{ isLive: true }`, and in our game board slice, I call `state.timer = { isLive: true }`, then what changed?

To you and me, nothing changed.

However, this object is stored in memory as a _different_ object, so to React, `timer` was just updated. And because `timer` is a dependency of our `useEffect` function, it then runs our clean-up function, cancelling our timer, and it re-runs `useEffect`.

So in our `nextBlock()` action, when we run `state.timer = { isLive: true };`, even if `state.timer` is already equal to `{ isLive: true }`, it resets the timer for how long it is until `moveBlock(down)` is called in our `GameBoard` component.

And with that, we have now added a new block to our game board.

If this was the start of a new game, and the first block was a `J` block, our game board would now look like this:

![First block](/images/projects/blocks-falling/first-block.png)

Of course, that wasn't the end of our `nextBlock()` function. What about if `canAddBlock()` returns `false`?

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

The first thing that we do inside this `else` block, is run _another_ `if` check:

```js
if (!Object.keys(current(state.squares)[0]).map(square => current(state.squares)[0][square].status).includes(settled))
```

Remember that `current(state.squares)` is our current game board, so running `Object.keys(current(state.squares)[0])` simply returns the keys for the top row of our game board.

Unless the width of the game board changes, this is always going to be:

```js
['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
```

We then map over these squares, and return an array of their statuses, so

<!-- prettier-ignore -->
```js
['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(square => current(state.squares)[0][square].status)
```

is going to return something like:

```js
['dead', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead', 'dead'];
```

We then check if this array includes `settled`:

```js
.includes(settled)
```

And don't forget the `!` at the beginning of the `if` statement. That means that we will run the code returned within the `if` block if the statement is **not** true; so if the top row of our game board does **not** include a settled block.

Why? What on earth is going on?

Well we've already established in our `canAddBlock()` check that we cannot add a new block to our game board. The problem is that our dead row might still be empty.

The reason that we might not be able to add a new block, is that the space we need in row `1` (the second row) is not available. However, visually it looks very bad to end the game, when there is an empty row at the top of the game board.

It looks like we ended the game prematurely, because there's still a little bit of space up there. And if I was a player, that would piss me off.

So instead of ending the game with an empty row at the top, instead within this `if` block we run:

<!-- prettier-ignore -->
```js
state.squares = mergeNestedObjects(current(state.squares), { 0: { ...newBlockShape(newBlock)[1] }, });
```

We've been over `mergeNestedObjects()` already; this is the function that returns our updated game board. But why are we calling it here, when we already know that we can't add a new block?

Let's take a look at what we're passing-in as the second argument here:

```js
{ 0: { ...newBlockShape(newBlock)[1] }, }
```

Remember that the second argument that we pass-into `mergeNestedObjects()` is our `newObject` argument. It's an object of what we want to amend in our current game board object.

`...newBlockShape(newBlock)[1]` is our new block's `1` row, yet we're passing it in here with a key of `0`. Why would we do that?

Let's continue to use a `J` block as our example, so this would be the return from `newBlockShape(newBlock)`:

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

`{ ...newBlockShape(newBlock)[1] }` is going to be equal to

```js
{
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
}
```

which is the _bottom_ row of our new block.

But we can't assign it to row `1` of our game board, because there is no space, so instead we assign it to row `0`; we assign what would otherwise go into row `1`, into row `0`, for example:

![Half block](/images/projects/blocks-falling/half-block.png)

What you see at the very top of the game board here; the very top piece, is the bottom half of an `S` block.

There wasn't space to have it on row `1`, because there's a `Z` block already there. But if we'd thrown a 'game over' while there was still an empty row at the top, visually it is very poor.

So instead, we add _half_ of this `S` block onto row `0`, so that the player can see that their stack of blocks actually _did_ make it to the top of the game board.

That's what

```js
{ 0: { ...newBlockShape(newBlock)[1] }, }
```

does. It passes-in row `1` of our new block to `mergeNestedObjects()`, as row `0`.

### Game over

Still within the `else` block of if `canAddBlock()` returns false, the very last line of the `nextBlock()` action is simply:

```js
state.status = gameOver;
```

The `gameOver` variable is simply the string `'game-over'` to prevent typos, so nothing too exciting here. And updating the `status` to `gameOver` does a couple of things.

Firstly, within our `GameBoard` component, each square has its own `<div>`:

```js
<div
  key={`square-${row}-${column}`}
  className={`${styles.square} ${styles[squares[row][column].status]} ${
    styles[squares[row][column].block] || ''
  } ${status === gameOver ? styles['game-over'] : ''}`}
/>
```

I won't go over everything that's happening here, but if you look at that bottom line, when our status is `gameOver`, it adds the `'game-over'` CSS class to this `<div>`.

And if you look in our `GameBoard` component styling:

```css
/* src/components/Gameboard.module.css */

.i-block.game-over,
.j-block.game-over,
.l-block.game-over,
.o-block.game-over,
.s-block.game-over,
.t-block.game-over,
.z-block.game-over {
  background-color: gray;
  transition: background-color 1s;
}

.i-block {
  background-color: red;
}

.j-block {
  background-color: gold;
}

.l-block {
  background-color: blue;
}

.o-block {
  background-color: green;
}

.s-block {
  background-color: chocolate;
}

.t-block {
  background-color: orange;
}

.z-block {
  background-color: fuchsia;
}
```

When there is no `game-over` class, each of the blocks has a different background color. However, once the `game-over` class is added, thanks to CSS specificity rules, all of these individual background colors are overwritten with

```css
.i-block.game-over,
.j-block.game-over,
.l-block.game-over,
.o-block.game-over,
.s-block.game-over,
.t-block.game-over,
.z-block.game-over {
  background-color: gray;
  transition: background-color 1s;
}
```

which transitions all of the squares within our game board that have a block, to be gray, for example:

![Game over](/images/projects/blocks-falling/game-over.png)
_Game over_

Within our `App.js` component, there's also the following `useEffect` block:

```js
useEffect(() => {
  if (status === gameOver) {
    if ((topScore && clearedRows > topScore) || (!topScore && clearedRows > 0)) {
      setTopScoreState(clearedRows);
      localStorage.setItem('blocks-falling.top-score', clearedRows);
    }
  }
}, [status]);
```

`clearedRows` is a state within our game board state slice, which counts how many lines the user cleared while playing, and determines their overall score (more on that later):

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

`topScore` comes from our `topScoreSlice`, which is the only _other_ state slice in this app (apart from our game board slice).

Within `App.js` is another `useEffect` block:

```js
import useSetTopScoreState from './hooks/use-set-top-score-state';

const App = () => {
  const setTopScoreState = useSetTopScoreState();

  useEffect(() => {
    if (localStorage.getItem('blocks-falling.top-score'))
      setTopScoreState(localStorage.getItem('blocks-falling.top-score'));
  }, [setTopScoreState]);
};
```

`setTopScoreState` is just the function returned from the `useSetTopScoreState` hook, so even though that has been added as a dependecy to `useEffect` here, as it never changes, this `useEffect` block will only ever be called as the page loads.

We store the player's top score in their local storage with the key `blocks-falling.top-score`, which if you zoom-in, you can see here:

![Local storage](/images/projects/blocks-falling/local-storage.png)
_Top score stored in local storage_

So after checking that a top-score exists with `if (localStorage.getItem('blocks-falling.top-score'))`, then `setTopScoreState(localStorage.getItem('blocks-falling.top-score'));` calls the `useSetTopScoreState` hook, passing-in the current top score as an argument.

This is a very simple hook that does exactly what it says on the tin, I just separated it into a hook to keep my code as concise as possible. But all it does is call `dispatch(topScoreActions.setTopScore(score));`, which runs an action in our top-score slice, to update our `topScore` state:

```js
// src/hooks/use-set-top-score-state.js

import { useDispatch } from 'react-redux';

import { topScoreActions } from '../store/top-score';

const useSetTopScoreState = () => {
  const dispatch = useDispatch();

  const setTopScoreState = score => {
    dispatch(topScoreActions.setTopScore(score));
  };

  return setTopScoreState;
};

export default useSetTopScoreState;
```

The `setTopScore` action is simply:

```js
setTopScore(state, action) {
  state.topScore = action.payload;
},
```

So with this, when our app loads, we check local storage for an existing top score, and set it to `topScore`.

Then, at the end of the game, when `status` is updated to `'game-over'`, the other `useEffect` block is run:

```js
useEffect(() => {
  if (status === gameOver) {
    if ((topScore && clearedRows > topScore) || (!topScore && clearedRows > 0)) {
      setTopScoreState(clearedRows);
      localStorage.setItem('blocks-falling.top-score', clearedRows);
    }
  }
}, [status]);
```

We now firstly check that there is an existing `topScore`, and that `clearedRows` is higher than this current `topScore`,

```js
topScore && clearedRows > topScore;
```

or that there is no `topScore` but the number of `clearedRows` is greater than `0`:

```js
!topScore && clearedRows > 0;
```

And if either of those things are true, then we do two things.

Firstly, we update our `topScore` state to the number of `clearedRows`. And secondly, we update our local storage _to this_ new `topScore` (meaning that if the user closes their browser, this score is persisted):

```js
setTopScoreState(clearedRows);
localStorage.setItem('blocks-falling.top-score', clearedRows);
```

And with that, we have finally... finally, got to the end of our `nextBlock()` action. And thankfully, that's the most complicated action that we have in this app, so hopefully the other ones will be a bit quicker to go over.

But after what must now feel like a lifetime to you, we now have one block on our game board. At the very top. And it hasn't even moved yet. So strap-in, because things are about to get wild.

## Moving blocks

Given the eventual name of this app, it seems appropriate that the first direction for moving a block that we look at, is down.

### Down

Unlike left and right, moving a block down can happen in two ways.

Not only can the user move the block down, but the block will move down automatically at timed intervals, hence the blocks... falling. And if you remember, we've already been over the code in the `GameBoard` component where we call the `moveBlock(down)` function:

```js
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
```

We've been over _when_ this `useEffect` block gets called (whenever `status` or `timer` gets updated). However, we haven't yet been over what `moveBlock(down)` actually does.

And firstly, the `moveBlock()` function call simply calls the `useMoveBlock` hook;

```js
import useMoveBlock from '../hooks/use-move-block';

const GameBoard = () => {
  const moveBlock = useMoveBlock();
};
```

The `down` variable is simply the string `'down'`.

So when we call `moveBlock(down)`, we're simply calling the `useMoveBlock` hook, passing-in the `direction` as `'down'`.

The `useMoveBlock` is as follows:

```js
// src/hooks/use-move-block.js

import useGameIsInProgress from './use-game-is-in-progress';
import useMoveBlockDown from './use-move-block-down';
import useMoveBlockLeft from './use-move-block-left';
import useMoveBlockRight from './use-move-block-right';
import { down, left, right } from '../store/game-board';

const useMoveBlock = () => {
  const gameIsInProgress = useGameIsInProgress();
  const moveBlockDown = useMoveBlockDown();
  const moveBlockLeft = useMoveBlockLeft();
  const moveBlockRight = useMoveBlockRight();

  const moveBlock = direction => {
    if (!gameIsInProgress()) return;

    switch (direction) {
      case down:
        moveBlockDown();
        break;
      case left:
        moveBlockLeft();
        break;
      case right:
        moveBlockRight();
        break;
      default:
        throw new Error('Incorrect direction passed to useMoveBlock');
    }
  };

  return moveBlock;
};

export default useMoveBlock;
```

It does very little. Firstly it checks that the game is in progress by calling the `useGameIsInProgress` hook:

```js
import useGameIsInProgress from './use-game-is-in-progress';

const useMoveBlock = () => {
  const gameIsInProgress = useGameIsInProgress();

  const moveBlock = direction => {
    if (!gameIsInProgress()) return;
  };
};
```

The `useGameIsInProgress` hooks is as simple as they come; it simply checks whether `statusRef.current` (remember that?) is equal to `in-progress`:

```js
// src/hooks/use-game-is-in-progress.js

import { statusRef } from '../components/GameBoard';
import { inProgress } from '../store/game-board';

const useGameIsInProgress = () => {
  const gameIsInProgress = () => statusRef.current === inProgress;

  return gameIsInProgress;
};

export default useGameIsInProgress;
```

So when we call `if (!gameIsInProgress()) return;` in `useMoveBlock`, we're saying to `return` if the game is **not** in progress. So, for example, a user cannot pause the game and then start moving blocks around.

However, if the game _is_ in progress, then all that `useMoveBlock` does is call _another_ hook, depending on which `direction` the was passed-in.

In this example, we passed-in `'down'` as the `direction` argument, so we will now call the `useMoveBlockDown` hook:

```js
import useMoveBlockDown from './use-move-block-down';
import { down } from '../store/game-board';

const useMoveBlock = () => {
  const moveBlockDown = useMoveBlockDown();

  const moveBlock = direction => {
    switch (direction) {
      case down:
        moveBlockDown();
        break;
    }
  };

  return moveBlock;
};

export default useMoveBlock;
```

This is the part of the article where things become a little... hooky.

For better or for worse, I love to break my code down into tiny pieces of logic to be re-used as needed. So hooks get called within hooks within hooks. And if you don't like hooks, you're probably not going to have a good time.

With that in mind, let us continue.

This is the `useMoveBlockDown` hook:

```js
// src/hooks/use-move-block-down.js

import { useDispatch } from 'react-redux';

import { down, gameBoardActions } from '../store/game-board';
import useCanMoveBlock from './use-can-move-block';
import useLiveBlockShape from './use-live-block-shape';
import useUpdatedGameBoard from './use-updated-game-board';
import useSettledBlock from './use-settled-block';

const useMoveBlockDown = () => {
  const dispatch = useDispatch();
  const canMove = useCanMoveBlock();
  const liveBlockShape = useLiveBlockShape();
  const updatedGameBoard = useUpdatedGameBoard();
  const settledBlock = useSettledBlock();

  const moveBlockDown = () => {
    dispatch(gameBoardActions.stopTimer());

    if (canMove(down)) {
      const initialShape = liveBlockShape();
      let movedBlock = {};

      Object.keys(initialShape).forEach(rowKey => {
        movedBlock[parseInt(rowKey) + 1] = {};
        Object.keys(initialShape[rowKey]).forEach(columnKey => {
          movedBlock[parseInt(rowKey) + 1][columnKey] = initialShape[rowKey][columnKey];
        });
      });

      dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(movedBlock)));
    } else {
      dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(settledBlock())));
      dispatch(gameBoardActions.updateClearedRows());
      dispatch(gameBoardActions.clearCompletedRows());
      dispatch(gameBoardActions.nextBlock());
    }
    dispatch(gameBoardActions.startTimer());
  };

  return moveBlockDown;
};

export default useMoveBlockDown;
```

The first thing that this hook does within the `moveBlockDown` function is call:

```js
dispatch(gameBoardActions.stopTimer());
```

This calls an action within our game board slice which, as you might be able to guess, stops the timer:

```js
stopTimer(state) {
  state.timer = { isLive: false };
},
```

It changes `state.timer` to `{ isLive: false }`, and if you remember in our `GameBoard` component, we only make the `moveBlock(down)` function call _if_ `timer.isLive` is true:

```js
if (timer.isLive) {
  timeOut = setTimeout(() => {
    moveBlock(down);
  }, speed);
}
```

So the first thing we've done, is stop our timer. At this point, `moveBlock(down)` isn't going to automatically called again.

Next in our `moveBlockDown()` function we run an `if` check:

```js
if (canMove(down)) {
  const initialShape = liveBlockShape();
  let movedBlock = {};

  Object.keys(initialShape).forEach(rowKey => {
    movedBlock[parseInt(rowKey) + 1] = {};
    Object.keys(initialShape[rowKey]).forEach(columnKey => {
      movedBlock[parseInt(rowKey) + 1][columnKey] = initialShape[rowKey][columnKey];
    });
  });

  dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(movedBlock)));
} else {
  dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(settledBlock())));
  dispatch(gameBoardActions.updateClearedRows());
  dispatch(gameBoardActions.clearCompletedRows());
  dispatch(gameBoardActions.nextBlock());
}
```

We run `if (canMove(down)) {` which, as the name suggests, checks whether or not we can actually move our block down.

What am I talking about?

Well, we don't want to move our 'live' block down under two circumstances:

- If it's already at the bottom of the game board
- If there's another block beneath it

The `canMove(down)` call simple calls the `useCanMoveBlock` hook and passes-in the string `'down'`:

```js
import useCanMoveBlock from './use-can-move-block';

const useMoveBlockDown = () => {
  const canMove = useCanMoveBlock();
};
```

And guess what?

Yep, the `useCanMoveBlock` imports five more hooks:

```js
// src/hooks/use-can-move-block.js

import useIsTouchingBottom from './use-is-touching-bottom';
import useIsTouchingWall from './use-is-touching-wall';
import useIsBlockBelow from './use-is-block-below';
import useIsBlockToSide from './use-is-block-to-side';
import useGameIsInProgress from './use-game-is-in-progress';
import { down, left, right } from '../store/game-board';

const useCanMoveBlock = () => {
  const isTouchingBottom = useIsTouchingBottom();
  const isTouchingWall = useIsTouchingWall();
  const isBlockBelow = useIsBlockBelow();
  const isBlockToSide = useIsBlockToSide();
  const gameIsInProgress = useGameIsInProgress();

  const canMoveDown = () => {
    return !isTouchingBottom() && !isBlockBelow();
  };

  const canMoveLeft = () => {
    return !isTouchingWall(left) && !isBlockToSide(left);
  };

  const canMoveRight = () => {
    return !isTouchingWall(right) && !isBlockToSide(right);
  };

  const canMove = direction => {
    if (!gameIsInProgress()) return false;

    switch (direction) {
      case down:
        return canMoveDown();
      case left:
        return canMoveLeft();
      case right:
        return canMoveRight();
      default:
        return;
    }
  };

  return canMove;
};

export default useCanMoveBlock;
```

We might be here all night.

Only two of these hooks are relevant here, however.

Within the `canMove` function we check the `direction` that was passed-in:

```js
switch (direction) {
  case down:
    return canMoveDown();
  case left:
    return canMoveLeft();
  case right:
    return canMoveRight();
  default:
    return;
}
```

As we passed-in `'down'`, we run the `canMoveDown()` function, which calls two hooks:

```js
const canMoveDown = () => {
  return !isTouchingBottom() && !isBlockBelow();
};
```

`isTouchingBottom()` calls the `useIsTouchingBottom` hook and `isBlockBelow()` calls the `useIsBlockBelow` hook.

Let's go over both of these. First off, this is the `useIsTouchingBottom` hook:

```js
// src/hooks/use-is-touching-bottom.js

import { squaresRef } from '../components/GameBoard';
import { live } from '../store/game-board';

const useIsTouchingBottom = () => {
  const isTouchingBottom = () => {
    return Object.keys(squaresRef.current[20])
      .map(square => squaresRef.current[20][square].status)
      .includes(live);
  };

  return isTouchingBottom;
};

export default useIsTouchingBottom;
```

Look... it doesn't call any more hooks!

Now, if you remember, our game board has 21 rows, going from `0` to `20`. `squaresRef.current[20]` is the bottom row of our game board, so when we run `Object.keys(squaresRef.current[20])` it simply returns all the columns in the bottom row.

Just like with the top row, unless something changes in the future, this will always be `['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']`.

So we map over this array, getting the `status` of each of the squares on the bottom row of our game board and storing it in an array, as we did earlier for the top row:

<!-- prettier-ignore -->
```js
['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(square => squaresRef.current[20][square].status);
```

We then check if this array includes the status `'live'`:

```js
.includes(live);
```

If any of the squares on the bottom row of our game board _do_ have the `status` of `live`, then we know that our `live` block has reached the bottom of the game board, in which case we return `true` from our `useIsTouchingBottom` hook, because it _is_ touching the bottom.

However, if none of the squares on the bottom row of our game board have a status of `live`, then we return `false` from `useIsTouchingBottom`, because we know that our live block is **not** touching the bottom.

We also need to check if there is a block _below_ our live block. and that's where our `useIsBlockBelow` hook comes in:

```js
// src/hooks/use-is-block-below.js

import { squaresRef } from '../components/GameBoard';
import { live, settled } from '../store/game-board';

const useIsBlockBelow = () => {
  const isBlockBelow = () => {
    let belowSquaresStatusArray = [];

    Object.keys(squaresRef.current).forEach(rowKey =>
      Object.keys(squaresRef.current[rowKey]).forEach(columnKey => {
        if (squaresRef.current[rowKey][columnKey].status === live) {
          belowSquaresStatusArray.push(squaresRef.current[parseInt(rowKey) + 1][columnKey].status);
        }
      })
    );

    return belowSquaresStatusArray.includes(settled);
  };

  return isBlockBelow;
};

export default useIsBlockBelow;
```

And look, this one doesn't import any other hooks either. The nightmare is over!

So what on earth is this hook doing?

Remember that `squaresRef.current` is our current game board. Well as we've done before, the first thing we do is fetch all of our row keys:

```js
Object.keys(squaresRef.current);
```

We then enter a loopception, firstly looping-over all of these keys, and then the squares/columns within each of these rows:

```js
Object.keys(squaresRef.current).forEach(rowKey =>
  Object.keys(squaresRef.current[rowKey]).forEach(columnKey => {
```

This very unelegantly allows us to loop-over every square of our game board. We then do an `if` check to find and only continue _if_ that square is `'live'`:

```js
if (squaresRef.current[rowKey][columnKey].status === live) {
```

_If_ a square _is_ `'live'`, we then run:

```js
belowSquaresStatusArray.push(squaresRef.current[parseInt(rowKey) + 1][columnKey].status);
```

`belowSquaresStatusArray` started off this function as an empty array:

```js
let belowSquaresStatusArray = [];
```

What we're then doing here, is getting the square _below_ our current `'live'` square:

```js
squaresRef.current[parseInt(rowKey) + 1][columnKey];
```

If you notice the `+ 1` in `parseInt(rowKey) + 1`, that means that we get the row _below_ our current row, which we've have already checked is `'live'`. We then push the `status` of this square that is _below_ our `'live'` square to our `belowSquaresStatusArray`.

In the last line of this function, we check if the `belowSquaresStatusArray` includes `'settled'`. If it does, we know that there's a `'settled'` block below our current block, if it doesn't we know that there's not.

So we return `true` from our `useIsBlockBelow` hook, if there is a `'settled'` block below our `'live'` block, and we return `false` if there's not:

```js
return belowSquaresStatusArray.includes(settled);
```

If you remember back to our `useCanMoveBlock` hook, these two hooks that we've just been over, checked if we could move our live block down:

```js
const canMoveDown = () => {
  return !isTouchingBottom() && !isBlockBelow();
};
```

And if `isTouchingBottom()` returns `false`, and `isBlockBelow()` returns false, then `canMoveDown()` returns `true` (note the `!`).

So going back to our `useMoveBlockDown` hook, we now know how our `if (canMove(down)) {` check works:

```js
if (canMove(down)) {
  const initialShape = liveBlockShape();
  let movedBlock = {};

  Object.keys(initialShape).forEach(rowKey => {
    movedBlock[parseInt(rowKey) + 1] = {};
    Object.keys(initialShape[rowKey]).forEach(columnKey => {
      movedBlock[parseInt(rowKey) + 1][columnKey] = initialShape[rowKey][columnKey];
    });
  });

  dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(movedBlock)));
} else {
  dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(settledBlock())));
  dispatch(gameBoardActions.updateClearedRows());
  dispatch(gameBoardActions.clearCompletedRows());
  dispatch(gameBoardActions.nextBlock());
}
```

So next let's look at what we do in each scenario.

Firstly, if we _can_ move a block down.

Unsurprisingly, the first thing we do is call another hook; this time the `useLiveBlockShape` hook:

```js
const initialShape = liveBlockShape();
```

The `useLiveBlockShape` hook is as follows:

```js
// src/hooks/use-live-block-shape.js

import { squaresRef } from '../components/GameBoard';
import { live } from '../store/game-board';

const useLiveBlockShape = () => {
  const liveBlockShape = () => {
    let returnObject = {};

    Object.keys(squaresRef.current).forEach(rowKey =>
      Object.keys(squaresRef.current[rowKey]).forEach(columnKey => {
        if (squaresRef.current[rowKey][columnKey].status === live) {
          if (!returnObject[rowKey]) returnObject[rowKey] = {};
          if (!returnObject[rowKey][columnKey]) returnObject[rowKey][columnKey] = {};
          returnObject[rowKey][columnKey].status = live;
          returnObject[rowKey][columnKey].block = squaresRef.current[rowKey][columnKey].block;
        }
      })
    );

    return returnObject;
  };

  return liveBlockShape;
};

export default useLiveBlockShape;
```

What this hook does, is fetch our current `'live'` block from within our game board.

We have a `returnObject` that starts its life as an empty object (`{}`).

Then, as we've done so many times already, we enter a loopception where we firstly loop over all the rows of our game board

```js
Object.keys(squaresRef.current).forEach(rowKey =>
```

and then over the columns within each of these rows:

```js
Object.keys(squaresRef.current[rowKey]).forEach(columnKey => {
```

This, as I'm sure you've gathered by this point, loops over all of the squares in our game board.

As we're only interested in finding our `'live'` block within our game board, the first thing we do is check whether the current square in our loopception is `'live'`:

```js
if (squaresRef.current[rowKey][columnKey].status === live) {
```

If its not `'live'`, we ignore it and move onto the next loop. However, if it is... well the first thing we need to do, is create an object within our `returnObject` object for that object if no object exists.

I just said object five times in eleven words. Beat that!

```js
if (!returnObject[rowKey]) returnObject[rowKey] = {};
```

`if (!returnObject[rowKey])` checks if an object for the current row of our loopception exists, and if it doesn't (note the `!`), we create an empty object with `returnObject[rowKey] = {}`.

We then do the same thing for that particular square within the row:

```js
if (!returnObject[rowKey][columnKey]) returnObject[rowKey][columnKey] = {};
```

I'm not sure why I added the `if` check here, because as we only loop over each square once, no such square should exist here, but whatever.

Because we know we're looping over a `'live'` square, we also add an empty object here.

And now that we have our 'row' and our 'square' (column) objects, we just need to populate them:

```js
returnObject[rowKey][columnKey].status = live;
returnObject[rowKey][columnKey].block = squaresRef.current[rowKey][columnKey].block;
```

As we already know that this square's `status` is `'live'`, then we simply set it to `'live'`. As for the `block`, we check within our game board (`squaresRef.current`) and set the block within `returnObject` to match the corresponding block of our game board.

Then, by the time we get to the end of our loopception, we're left with an object, set to the `returnObject` variable, which contains just our `'live'` block.

Obviously this will look different depending on where on our game board the block is, and what kind of block it is, but going back to our `'J'` block example from earlier, if the block is on the top row of our game board and hasn't been moved yet, then the return from `useLiveBlockShape` would be:

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

Going back to `useMoveBlockDown`, now that we know our current block, we need to move it:

```js
if (canMove(down)) {
  const initialShape = liveBlockShape();
  let movedBlock = {};

  Object.keys(initialShape).forEach(rowKey => {
    movedBlock[parseInt(rowKey) + 1] = {};
    Object.keys(initialShape[rowKey]).forEach(columnKey => {
      movedBlock[parseInt(rowKey) + 1][columnKey] = initialShape[rowKey][columnKey];
    });
  });

  dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(movedBlock)));
} else {
```

So the first thing we do, is create a `movedBlock` variable that is an empty object:

```js
let movedBlock = {};
```

This is where we'll store our moved block... surprisingly.

Remembering that `initialShape` is the object of our current live block, we then loop over `initialShape`:

```js
Object.keys(initialShape).forEach(rowKey => {
```

And the first thing we want to do, is create a new row within our `movedBlock` object, one row **below** the rows that exist in our `initialShape`:

```js
movedBlock[parseInt(rowKey) + 1] = {};
```

So if our `initialShape` has a row of `0`, then here we create a new row with the key of `1`.

We then go into a loopception, where we loop over the columns within this row of our `initialShape`:

```js
Object.keys(initialShape[rowKey]).forEach(columnKey => {
```

As we're moving the block down, and not left or right, we have no interest in changing the columns of the block, so we simply copy the contents of this square to our new row, that is one row below where it exists in `initialShape`:

```js
movedBlock[parseInt(rowKey) + 1][columnKey] = initialShape[rowKey][columnKey];
```

Once our loopception has finished, what we're left with in our `movedBlock` variable, is an exact copy of our `initialShape` variable, except the block has been moved down one row.

So for example, if `initialShape` was

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

then `movedBlock` would be:

```js
{
  1: {
    4: {
      status: 'live',
      block: 'j-block',
    },
  },
  2: {
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

And now that we know how we want updated `'live'` block to look, all we need to do is update our state, which we do by calling:

```js
dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(movedBlock)));
```

The `updatedGameBoard()` function call (not to be confused with the `updateGameBoard()` action) calls the `useUpdatedGameBoard` hook (dammit!).

When you pass-in a block that has been moved, in this case the aptly named `movedBlock`, then the `useUpdatedGameBoard` hook will return the entire game board, updated with this `movedBlock`.

Exciting.

Let's take a look:

```js
// src/hooks/use-updated-game-board.js

import { squaresRef } from '../components/GameBoard';
import { live, dead, empty } from '../store/game-board';

const useUpdatedGameBoard = () => {
  const updatedGameBoard = movedBlock => {
    let existingObject = JSON.parse(JSON.stringify(squaresRef.current));
    let newObject = JSON.parse(JSON.stringify(existingObject));

    Object.keys(existingObject).forEach(rowKey =>
      Object.keys(existingObject[rowKey]).forEach(columnKey => {
        if (existingObject[rowKey][columnKey].status === live) {
          newObject[rowKey][columnKey] = { status: rowKey === '0' ? dead : empty, block: '' };
        }
        if (movedBlock[rowKey] && movedBlock[rowKey][columnKey]) {
          newObject[rowKey][columnKey] = { ...movedBlock[rowKey][columnKey] };
        }
      })
    );

    return newObject;
  };

  return updatedGameBoard;
};

export default useUpdatedGameBoard;
```

`JSON.parse(JSON.stringify(squaresRef.current))` simply 'clones' `squaresRef.current` (our game board), meaning that it makes a copy of it. We then assign it to the `existingObject` variable.

`JSON.parse(JSON.stringify(existingObject))` does exactly the same thing, but on `existingObject`, and assigns it to the `newObject` variable.

```js
let existingObject = JSON.parse(JSON.stringify(squaresRef.current));
let newObject = JSON.parse(JSON.stringify(existingObject));
```

At this point, `existingObject` and `newObject` are identical copies of each other. However, as you might be able to tell, `newObject` is going to get updated to how we want our updated game board object to look.

We're once again going to go into a loopception, where we loop over the rows and columns of our game board:

```js
Object.keys(existingObject).forEach(rowKey =>
  Object.keys(existingObject[rowKey]).forEach(columnKey => {
```

And within our loopception, the first thing that we're going to do is check if a square is `'live'`, and if it is, 'clear' this square in our `newObject`:

```js
if (existingObject[rowKey][columnKey].status === live) {
  newObject[rowKey][columnKey] = { status: rowKey === '0' ? dead : empty, block: '' };
}
```

`status: rowKey === '0' ? dead : empty` simply checks whether this is the top row of our game board. If it is, the `status` is changed to `'dead'`, if it's not, the `status` is changed to `'empty'`.

Then _once_ this square has been cleared (if it's `'live'`), we check our `movedBlock` (remember, that's our block in its new position), and _if_ this square exists in our `movedBlock` object, we update the corresponding square of `newObject` to match it:

```js
if (movedBlock[rowKey] && movedBlock[rowKey][columnKey]) {
  newObject[rowKey][columnKey] = { ...movedBlock[rowKey][columnKey] };
}
```

Once we've finished our loopception, `newObject` has been updated so that the previous `'live'` squares were changed to `'empty'` or `'dead'`, and the new `'live'` squares have been copied over from `movedBlock`.

That means that `newObject` _is_ what we want to update our game board to.

We return `newObject` from the `useUpdatedGameBoard` hook:

```js
return newObject;
```

Now remember where we're up to in our `useMoveBlockDown` hook:

```js
dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(movedBlock)));
```

We now know that the return from `updatedGameBoard(movedBlock)` _is_ our new game board.

We then call the `updateGameBoard()` action, passing-in this updated game board as the argument.

And the `updateGameBoard()` action is very simple:

```js
updateGameBoard(state, action) {
  state.squares = action.payload;
},
```

It simply updates our `squares` state to be our updated game board. So at this point, we've successfully moved our block down, and the updated game board is being displayed to our player.

What about if we can't move our block down though?

```js
if (canMove(down)) {
  // Stuff we've already been over here
} else {
  dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(settledBlock())));
  dispatch(gameBoardActions.updateClearedRows());
  dispatch(gameBoardActions.clearCompletedRows());
  dispatch(gameBoardActions.nextBlock());
}
```

Well... the good news is that we don't call any new hooks here.

I'm just joking, of course we do. `settledBlock()` calls the `useSettledBlock()` hook:

```js
// src/hooks/use-settled-block.js

import { settled } from '../store/game-board';
import useLiveBlockShape from './use-live-block-shape';

const useSettledBlock = () => {
  const liveBlockShape = useLiveBlockShape();

  const settledBlock = () => {
    const initialShape = liveBlockShape();
    let returnBlock = {};

    Object.keys(initialShape).forEach(rowKey => {
      returnBlock[rowKey] = {};
      Object.keys(initialShape[rowKey]).forEach(columnKey => {
        returnBlock[rowKey][columnKey] = {
          status: settled,
          block: initialShape[rowKey][columnKey].block,
        };
      });
    });

    return returnBlock;
  };

  return settledBlock;
};

export default useSettledBlock;
```

Luckily, the only hook called in this hook, we have already been over. It just calls `useLiveBlockShape`, which you'll remember with a feeling of despondence returns the current `'live'` block.

So in this hook, `initialShape` is our current `'live'` block. `returnBlock` is the object that we're going to return.

```js
const initialShape = liveBlockShape();
let returnBlock = {};
```

This should all be starting to look quite familiar, but this hook _also_ runs a loopception where loop over the rows and the columns within then, this time of `initialShape`:

```js
Object.keys(initialShape).forEach(rowKey => {
  returnBlock[rowKey] = {};
  Object.keys(initialShape[rowKey]).forEach(columnKey => {
```

`returnBlock[rowKey] = {};` creates a row within our `returnBlock` for each row of `initialShape`.

Then all we do, is add a square within `returnBlock` which matches the corresponding square within `initialShape`, _except_ that we update the `status` to `'settled'`:

```js
returnBlock[rowKey][columnKey] = {
  status: settled,
  block: initialShape[rowKey][columnKey].block,
};
```

So for example, if `initialShape` was

```js
{
  1: {
    4: {
      status: 'live',
      block: 'j-block',
    },
  },
  2: {
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

then `returnBlock` would be

```js
{
  1: {
    4: {
      status: 'settled',
      block: 'j-block',
    },
  },
  2: {
    4: {
      status: 'settled',
      block: 'j-block',
    }
    5: {
      status: 'settled',
      block: 'j-block',
    }
    6: {
      status: 'settled',
      block: 'j-block',
    }
  },
};
```

Going back to our `useMoveBlockDown` hook, the first action we call in the `else` block when `canMove(down)` returns `false`, is:

```js
dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(settledBlock())));
```

We now know that `settledBlock()` returns our `'live'` block, except the `status` for each of its squares has been updated to `'settled'`.

We've already been over that `updatedGameBoard()` calls our `useUpdatedGameBoard` hook and returns our updated game board, and that the `updateGameBoard()` action simply updates `squares` state to be this updated game board. So what this entire line does, is update the game board to "settle" our block.

After this, we call three more actions:

```js
if (canMove(down)) {
  // Stuff we've already been over here
} else {
  dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(settledBlock())));
  dispatch(gameBoardActions.updateClearedRows());
  dispatch(gameBoardActions.clearCompletedRows());
  dispatch(gameBoardActions.nextBlock());
}
```

The first one is the `updateClearedRows()` action, which is as follows:

```js
updateClearedRows(state) {
  if (isCompletedRows(current(state.squares))) {
    state.clearedRows = state.clearedRows + numberOfCompletedRows(current(state.squares));
    state.speed = Math.max(initialState.speed - state.clearedRows * 25, 100);
  }
},
```

Both `isCompletedRows()` and `numberOfCompletedRows()` are functions within our game board slice.

`isCompletedRows()` checks, unsurprisingly, if there are any completed rows.

If you're unfamiliar with the game 'Blocks Falling', which you should be because it's completely unique and hasn't been based on anything else in the world, then once a player "completes" a row (meaning that every square on that row is `'settled'`), then the row clears.

Yep, everything on that row just disappears. And any blocks above it move down a row.

Your score in 'Blocks Falling' is also determined by the number of rows that you clear.

So the first thing we need to know, is _if_ the user has completed any rows. That's where `isCompletedRows()` comes in:

```js
const isCompletedRows = currentGrid => {
  let returnBool = false;
  let statusArray = [];

  Object.keys(currentGrid).forEach(rowKey => {
    if (!returnBool) {
      statusArray = [];
      Object.keys(currentGrid[rowKey]).forEach(columnKey => {
        statusArray.push(currentGrid[rowKey][columnKey].status);
      });
      if (statusArray.every(status => status === settled)) returnBool = true;
    }
  });

  return returnBool;
};
```

This function is going to return one of two values: `true` or `false`, so we start by setting the `returnBool` to `false`.

The `currentGrid` was passed-in when we called this function, and is simmply our current game board:

```js
if (isCompletedRows(current(state.squares))) {
```

So what we do is loop over our current game board with:

```js
Object.keys(currentGrid).forEach(rowKey => {
```

Next we check the value of `returnBool`. If it is `true`, then we don't need to run anything else, because we only need to know if one row is completed:

```js
if (!returnBool) {
```

Assuming that it's false though, we reset the value of `statusArray` to be an empty array, and then loop-over the columns within our row loop:

```js
Object.keys(currentGrid[rowKey]).forEach(columnKey => {
```

This should look very familiar by this point.

We then `push` the `status` of every square on this row to our `statusArray`.

```js
statusArray.push(currentGrid[rowKey][columnKey].status);
```

And then once we've finished looping over each of the squares on a particular row, we check if every value of this array is `'settled'`. If it is, we update the `returnBool` to `true`, if it's not, it remains `false` and we all go on with our lives:

```js
if (statusArray.every(status => status === settled)) returnBool = true;
```

We then return `returnBool`, which will be either `true` or `false` depending on _if_ any rows are completed:

```js
return returnBool;
```

Back to our `updateClearedRows()` function:

```js
updateClearedRows(state) {
  if (isCompletedRows(current(state.squares))) {
    state.clearedRows = state.clearedRows + numberOfCompletedRows(current(state.squares));
    state.speed = Math.max(initialState.speed - state.clearedRows * 25, 100);
  }
},
```

If there are no completed rows, then we do nothing else here. However, if there are completed rows, we need to update `state.clearedRows`.

If you remember back to earlier, `clearedRows` is the state that determines our score, so it not only updates the scoreboard of our game, but it is also the value that we store in local storage to persist our player's top score.

And in order to update `state.clearedRows`, we need to know how many rows have been completed this term. That's where `numberOfCompletedRows(current(state.squares))` comes in.

As with `isCompletedRows`, we pass in the current game board as an argument:

```js
const numberOfCompletedRows = currentGrid => {
  let completedRows = [];
  let statusArray = [];

  Object.keys(currentGrid).forEach(rowKey => {
    statusArray = [];
    Object.keys(currentGrid[rowKey]).forEach(columnKey => {
      statusArray.push(currentGrid[rowKey][columnKey].status);
    });
    if (statusArray.every(status => status === settled)) completedRows.push(rowKey);
  });

  return completedRows.length;
};
```

This function is very similar to `isCompletedRows`, so I'll just point-out the differences in a futile attempt to keep this article below two hours.

Instead of having a `returnBool` variable, if every square on a row is `'settled'`, we add this row key to the `completedRows` array.

What we return is then the length of this array:

```js
return completedRows.length;
```

Going back to our `updateClearedRows()` action, the value returned here is then added onto the number of cleared rows that exists already, and this total is set as the new `clearedRows` state:

```js
state.clearedRows = state.clearedRows + numberOfCompletedRows(current(state.squares));
```

There's one more piece of state that we need to update in this action:

```js
updateClearedRows(state) {
  if (isCompletedRows(current(state.squares))) {
    state.clearedRows = state.clearedRows + numberOfCompletedRows(current(state.squares));
    state.speed = Math.max(initialState.speed - state.clearedRows * 25, 100);
  }
},
```

If you remember from earlier, the `speed` state is used in our `GameBoard` component to know how long the timeout (set in `setTimeout()`) should be before calling `moveBlock(down)`:

```js
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
```

`state.speed = Math.max(initialState.speed - state.clearedRows * 25, 100);` is the point that our `speed` state gets updated.

If you remember back to our `initialState` (it feels so long ago now), `speed` was set to `1000`:

```js
speed: 1000,
```

As the `speed` state is used in `setTimeout()`, `1000` means 1000 milliseconds (so one second).

So `initialState.speed - state.clearedRows * 25` means that we take our `initialState.speed` of `1000`, then subtract the number of `state.clearedRows` \* `25`.

For example, if we've cleared 10 rows, then `state.clearedRows * 25` would be `250`.

We'd subtract `250` from our `initialState.speed` of `1000`, leaving us with a speed of `750` (or three-quarters of a second).

`Math.max` returns the higher value of the entered values, so with `Math.max(initialState.speed - state.clearedRows * 25, 100);` we return whichever is highest `initialState.speed - state.clearedRows * 25` or `100`.

That is because once you're down to a speed of `100` (one tenth of a second), it's pretty damn fast already, and probably not long until the player reaches a game over, so no need to speed things up even more.

That is the end of our `updateClearedRows()` action:

```js
updateClearedRows(state) {
  if (isCompletedRows(current(state.squares))) {
    state.clearedRows = state.clearedRows + numberOfCompletedRows(current(state.squares));
    state.speed = Math.max(initialState.speed - state.clearedRows * 25, 100);
  }
},
```

Luckily for us, there are two more actions to go over in this `else` block of `useMoveBlockDown`. Yay!

The next one is `clearCompletedRows()`:

```js
if (canMove(down)) {
  // Stuff we've already been over here
} else {
  dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(settledBlock())));
  dispatch(gameBoardActions.updateClearedRows());
  dispatch(gameBoardActions.clearCompletedRows());
  dispatch(gameBoardActions.nextBlock());
}
```

With `updateClearedRows()` we've identified whether or not there are any cleared row, and updated the score and the game speed accordingly.

We haven't actually cleared the rows yet though. That's what `clearCompletedRows()` does:

```js
clearCompletedRows(state) {
  if (isCompletedRows(current(state.squares))) {
    state.squares = clearCompletedRows(current(state.squares));
  }
},
```

As with `updateClearedRows()` it firstly checks if there are any completed rows, using the `isCompletedRows()` function and passing-in the current game board.

If there aren't any completed rows, then nothing to see here. Go and get a beer.

If there are completed rows, we update `state.squares` to the return of the `clearCompletedRows()` function, where we pass-in the current game board:

```js
clearCompletedRows(current(state.squares));
```

The `clearCompletedRows()` function is as follows:

```js
const clearCompletedRows = currentGrid => {
  let returnObject = JSON.parse(JSON.stringify(currentGrid));
  let statusArray = [];

  Object.keys(returnObject).forEach(rowKey => {
    statusArray = [];
    Object.keys(returnObject[rowKey]).forEach(columnKey => {
      statusArray.push(returnObject[rowKey][columnKey].status);
    });
    if (statusArray.every(status => status === settled)) {
      [...Array(parseInt(rowKey)).keys()].reverse().forEach(fallingRowKey => {
        if (fallingRowKey === 0) {
          returnObject[fallingRowKey] = deadRow;
          returnObject[fallingRowKey + 1] = emptyRow;
        } else {
          returnObject[fallingRowKey + 1] = returnObject[fallingRowKey];
        }
      });
    }
  });

  return returnObject;
};
```

Much of this function should look familiar, because as I'm realising, I didn't do a very good of following DRY principles.

`let returnObject = JSON.parse(JSON.stringify(currentGrid));` clones our current game board and sets it to the `returnObject` variable. This is what we'll ultimately return from this function.

As I'm sure will be a complete surprise to you, we then loop over the rows in this `returnObject` variable:

```js
Object.keys(returnObject).forEach(rowKey => {
```

We again have a `statusArray` variable which we set to an empty array at the beginning of each 'row' loop. We then loop over the columns in each row, and `push` their `status`' to `statusArray`:

```js
Object.keys(returnObject[rowKey]).forEach(columnKey => {
  statusArray.push(returnObject[rowKey][columnKey].status);
});
```

We're only interested in working with 'completed' rows here, so the next thing we do is check whether every square in this row has a `status` of `'settled'`

```js
if (statusArray.every(status => status === settled)) {
```

and if it does...

```js
[...Array(parseInt(rowKey)).keys()].reverse().forEach(fallingRowKey => {
  if (fallingRowKey === 0) {
    returnObject[fallingRowKey] = deadRow;
    returnObject[fallingRowKey + 1] = emptyRow;
  } else {
    returnObject[fallingRowKey + 1] = returnObject[fallingRowKey];
  }
});
```

😢🔫

Remembering that we're in a loop over the rows of our game board (for a change), `rowKey` will be the current row in our iteration.

```js
[...Array(parseInt(rowKey)).keys()];
```

When you run, for example `Array(5)`, what you'll get is an array of `5` empty elements, for example `[...Array(5)]` returns:

```js
[undefined, undefined, undefined, undefined, undefined];
```

Not too useful yet.

However, when you run `keys()` on an array, what is returned is a new array containing all the indexes of the elements within the array, for example `[...Array(5).keys()]` returns:

```js
[0, 1, 2, 3, 4];
```

So when we run `[...Array(parseInt(rowKey)).keys()]`, what we're doing is returning an array of integers up to but **not** including our current `rowKey`.

A very important thing to notice is that we then `.reverse()` this array:

```js
[...Array(parseInt(rowKey)).keys()].reverse();
```

Why is that important?

`[...Array(parseInt(rowKey)).keys()]` returns all the rows up to but **not** including our current row; that means it includes all of the rows _above_ our current row.

What we're about to now do, is move all of these rows down one row, one at a time.

If we moved down starting with the top row, we'd have overwritten the row below, _before_ we'd moved it. So we move down the row _above_ the row that we're clearning. Then we move down the row above that, then the one above that, etc.

So in our `[...Array(parseInt(rowKey)).keys()].reverse().forEach(fallingRowKey => {` loop, in our first iteration, the `fallingRowKey` will be the row _above_ the row that we're clearing. In our second iteration, the `fallingRowKey` will be the row above that row. In our third iteration, the `fallingRowKey` will be the row above that.

You get the idea.

And within this loop, we run one more check:

```js
if (fallingRowKey === 0) {
  returnObject[fallingRowKey] = deadRow;
  returnObject[fallingRowKey + 1] = emptyRow;
} else {
  returnObject[fallingRowKey + 1] = returnObject[fallingRowKey];
}
```

The `if (fallingRowKey === 0) {` checks if the row we're moving down is the very top row of our game board.

As we already know, if a block becomes `'settled'` in row `0` (the top/dead row), then the game is over. That means that we'll never get here if there's a block in the top row. So we can safely assume that our top row is a `deadRow`, and the row below it, now that all the `'settled'` blocks have moved down, is an `emptyRow`:

```js
returnObject[fallingRowKey] = deadRow;
returnObject[fallingRowKey + 1] = emptyRow;
```

For all other rows, we want to move the row down.

```js
returnObject[fallingRowKey + 1] = returnObject[fallingRowKey];
```

By using the key of `fallingRowKey + 1`, we set the value of `returnObject[fallingRowKey]` to the row below it.

Once we've finished our loops, `returnObject` will therefore be our game board, with all the rows _above_ our 'cleared' row moved down.

The row that we've 'cleared' no longer exists either, because it has been overwritten by the row above it moving down and replacing it.

Going back to our `clearCompletedRows()` action:

```js
clearCompletedRows(state) {
  if (isCompletedRows(current(state.squares))) {
    state.squares = clearCompletedRows(current(state.squares));
  }
},
```

Now that I look at it, having a `clearCompletedRows()` action, and a `clearCompletedRows()` function probably wasn't the best naming I could have come up with.

However, ignoring my ineptitude, we now know that the return from the FUNCTION `clearCompletedRows()` is our updated game board, so in our `clearCompletedRows()` ACTION, we update `state.squares` to be this updated game board.

The last action we need to run in this `else` block our `useMoveBlockDown` hook, is `nextBlock()`.

```js
if (canMove(down)) {
  // Stuff we've already been over here
} else {
  dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(settledBlock())));
  dispatch(gameBoardActions.updateClearedRows());
  dispatch(gameBoardActions.clearCompletedRows());
  dispatch(gameBoardActions.nextBlock());
}
```

Thankfully we went over that earlier, which will save us all a lot of pain now.

As a reminder, it checks whether we can add a new block. If it can, we add a new block, if we can't... "Game over!" (I wrote that in Jigsaw's voice).

Looking back at `useMoveBlockDown` in its entirety:

```js
// src/hooks/use-move-block-down.js

import { useDispatch } from 'react-redux';

import { down, gameBoardActions } from '../store/game-board';
import useCanMoveBlock from './use-can-move-block';
import useLiveBlockShape from './use-live-block-shape';
import useUpdatedGameBoard from './use-updated-game-board';
import useSettledBlock from './use-settled-block';

const useMoveBlockDown = () => {
  const dispatch = useDispatch();
  const canMove = useCanMoveBlock();
  const liveBlockShape = useLiveBlockShape();
  const updatedGameBoard = useUpdatedGameBoard();
  const settledBlock = useSettledBlock();

  const moveBlockDown = () => {
    dispatch(gameBoardActions.stopTimer());

    if (canMove(down)) {
      const initialShape = liveBlockShape();
      let movedBlock = {};

      Object.keys(initialShape).forEach(rowKey => {
        movedBlock[parseInt(rowKey) + 1] = {};
        Object.keys(initialShape[rowKey]).forEach(columnKey => {
          movedBlock[parseInt(rowKey) + 1][columnKey] = initialShape[rowKey][columnKey];
        });
      });

      dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(movedBlock)));
    } else {
      dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(settledBlock())));
      dispatch(gameBoardActions.updateClearedRows());
      dispatch(gameBoardActions.clearCompletedRows());
      dispatch(gameBoardActions.nextBlock());
    }
    dispatch(gameBoardActions.startTimer());
  };

  return moveBlockDown;
};

export default useMoveBlockDown;
```

The last thing we do is call the `startTimer()` action.

This, if you couldn't guess, starts the timer:

```js
startTimer(state) {
  state.timer = { isLive: true };
},
```

So what we've done here in the `useMoveBlockDown` hook, is firstly check if the block _can_ move down. If it can, we update our game board to show the block as moved. If it can't we then settle the block, clear any completed rows, and add the next block.

Next we have to be able to move our block left and right 😲

### Left and right

Although there are obvious differences between left and right (like the direction), the code to do both actions is so similar, that it makes sense to go over them together.

In fact, let's just look at 'left'.

The code to move a block right is pretty much the same, just replace any instance of `left` with `right`.

And unlike moving a block down, there is no automated left or right movements; only the user will make them.

They can either use the left/right arrow keys on their keyboard, or they can use the on-screen left and right buttons.

As we've looked at it already, let's go back to the `handleKeyPress()` function in the `GameBoard` component:

```js
const handleKeyPress = event => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      moveBlock(down);
      break;
    case 'ArrowLeft':
      event.preventDefault();
      moveBlock(left);
      break;
    case 'ArrowRight':
      event.preventDefault();
      moveBlock(right);
      break;
    case 'z':
      ...
    case 'x':
      ...
    case ' ':
      ...
    default:
      return;
  }
};
```

Just like moving a block down, moving left or right starts with the `useMoveBlock` hook, only passing-in `'left'` or `'right'` instead.

And again, in the `useMoveBlock` hook, we call _another_ hook; this time either `useMoveBlockLeft` or `useMoveBlockRight`:

```js
// src/hooks/use-move-block.js

import useGameIsInProgress from './use-game-is-in-progress';
import useMoveBlockDown from './use-move-block-down';
import useMoveBlockLeft from './use-move-block-left';
import useMoveBlockRight from './use-move-block-right';
import { down, left, right } from '../store/game-board';

const useMoveBlock = () => {
  const gameIsInProgress = useGameIsInProgress();
  const moveBlockDown = useMoveBlockDown();
  const moveBlockLeft = useMoveBlockLeft();
  const moveBlockRight = useMoveBlockRight();

  const moveBlock = direction => {
    if (!gameIsInProgress()) return;

    switch (direction) {
      case down:
        moveBlockDown();
        break;
      case left:
        moveBlockLeft();
        break;
      case right:
        moveBlockRight();
        break;
      default:
        throw new Error('Incorrect direction passed to useMoveBlock');
    }
  };

  return moveBlock;
};

export default useMoveBlock;
```

And yet again, in the `useMoveBlockLeft` hook (kill me), the first thing that we do is call the `useCanMoveBlock` hook, this time passing-in the argument `'left'`:

```js
// src/hooks/use-move-block-left.js

import { useDispatch } from 'react-redux';

import { gameBoardActions, left } from '../store/game-board';
import useCanMoveBlock from './use-can-move-block';
import useLiveBlockShape from './use-live-block-shape';
import useUpdatedGameBoard from './use-updated-game-board';

const useMoveBlockLeft = () => {
  const dispatch = useDispatch();
  const canMove = useCanMoveBlock();
  const liveBlockShape = useLiveBlockShape();
  const updatedGameBoard = useUpdatedGameBoard();

  const moveBlockLeft = () => {
    if (!canMove(left)) return;

    const initialShape = liveBlockShape();
    let movedBlock = {};

    Object.keys(initialShape).forEach(rowKey => {
      movedBlock[rowKey] = {};
      Object.keys(initialShape[rowKey]).forEach(columnKey => {
        movedBlock[rowKey][parseInt(columnKey) - 1] = initialShape[rowKey][columnKey];
      });
    });

    dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(movedBlock)));
  };

  return moveBlockLeft;
};

export default useMoveBlockLeft;
```

I pasted this entire hook earlier; I won't do it again. They key part is that passing-in a `direction` of `'left'`, we call the `canMoveLeft()` function:

```js
const canMoveLeft = () => {
  return !isTouchingWall(left) && !isBlockToSide(left);
};
```

This calls two hooks that we haven't seen yet: `useIsTouchingWall` and `useIsBlockToSide`. I bet you can't guess what they do.

Starting with `useIsTouchingWall`:

```js
// src/hooks/use-is-touching-wall.js

import { squaresRef } from '../components/GameBoard';
import { left, live, right } from '../store/game-board';

const useIsTouchingWall = () => {
  const isTouchingWall = direction => {
    if (direction !== left && direction !== right)
      throw new Error('Incorrect direction passed to useIsTouchingWall');

    let statusArray = [];

    Object.keys(squaresRef.current).forEach(rowKey => {
      statusArray.push(squaresRef.current[rowKey][direction === left ? 1 : 10].status);
    });

    return statusArray.includes(live);
  };

  return isTouchingWall;
};

export default useIsTouchingWall;
```

After a quick check that the `direction` is valid with `if (direction !== left && direction !== right)`, this hook is fairly simple.

We loop-over the rows of our game board. I bet you didn't expect that. And then within this loop, we `push` the `status` of every square in column `1` if `direction` is `'left'`, or every square in column `10` if `direction` is `'right'`, to `statusArray`.

```js
Object.keys(squaresRef.current).forEach(rowKey => {
  statusArray.push(squaresRef.current[rowKey][direction === left ? 1 : 10].status);
});
```

Rememeber that column `1` is the very left of our game board, and column `10` is the very right of our game board. So the last thing that we do, is check whether our `statusArray` contains a `status` of `'live'`. If it does, then it means that our `'live'` block is touching the side wall of the game board. If it doesn't, then it's not.

```js
return statusArray.includes(live);
```

So this hook will return `true` if the `'live'` block is touching the side of the game board in the `direction` passed-in, and `false` otherwise.

The other hook that we call from the `useCanMoveBlock` hook is `useIsBlockToSide`.

We now already know whether or not our `'live'` block is at the side of the game board, but we also need to know whether or not there's a block next to it in the direction that we're trying to move it, and if there is, we need to block this move from happening.

So our `useIsBlockToSide` hook looks as follows:

```js
// src/hooks/use-is-block-to-side.js

import { squaresRef } from '../components/GameBoard';
import { left, live } from '../store/game-board';

const useIsBlockToSide = () => {
  const isBlockToSide = direction => {
    let besideSquaresStatusArray = [];

    Object.keys(squaresRef.current).forEach(rowKey =>
      Object.keys(squaresRef.current[rowKey]).forEach(columnKey => {
        if (squaresRef.current[rowKey][columnKey].status === live) {
          besideSquaresStatusArray.push(
            squaresRef.current[rowKey][parseInt(columnKey) + (direction === left ? -1 : 1)].status
          );
        }
      })
    );

    return besideSquaresStatusArray.includes('settled');
  };

  return isBlockToSide;
};

export default useIsBlockToSide;
```

In a break from tradition, this hook starts with a loop over the game board row, and then the columns within them:

```js
Object.keys(squaresRef.current).forEach(rowKey =>
  Object.keys(squaresRef.current[rowKey]).forEach(columnKey => {
```

I'm going to go out on a limb, and assume that you understand what that code's doing by now.

Within each iteration, we're then going to check whether or not that square has a `status` of `'live'`:

```js
if (squaresRef.current[rowKey][columnKey].status === live) {
```

At the start of this function, we set the aptly named `besideSquaresStatusArray` variable to an empty array.

What we're going to do, is fill this array with the `status` of the squares that are next to our `'live'` block, in the `direction` that was passed-in.

As we're looking at `'left'`, we're going to fill this array with the `status` of the squares to the left of our `'live'` block.

We do that with this line:

```js
squaresRef.current[rowKey][parseInt(columnKey) + (direction === left ? -1 : 1)].status;
```

Specifically, `parseInt(columnKey) + (direction === left ? -1 : 1)` fetches the square to the left (`-1`) of our `'live'` square (if `direction` is `'left'`), or to the right (`1`) of our `'live'` square (if `direction` is `'right'`).

We `push` these values to our `besideSquaresStatusArray` array, so once we get out of our loopception, all that we have to do is check whether this array includes `'settled'`. If it does, then there _is_ a block to the left of our current block, so we can't move there. If there's not, then it doesn't, and it's fine to move there.

```js
return besideSquaresStatusArray.includes('settled');
```

Looking back to the relevant part of our `useCanMoveBlock` hook:

```js
const canMoveLeft = () => {
  return !isTouchingWall(left) && !isBlockToSide(left);
};
```

If our `'live'` block is not touching the wall (to the left of it, in this example), and there's no block to the left of it either, then we _can_ move our live block to the left, otherwise, we can't.

That was the first check we run in the `moveBlockLeft()` function of our `useMoveBlockLeft` hook. Assuming that we _can_ move the block, let's continue on through this function:

```js
const moveBlockLeft = () => {
  if (!canMove(left)) return;

  const initialShape = liveBlockShape();
  let movedBlock = {};

  Object.keys(initialShape).forEach(rowKey => {
    movedBlock[rowKey] = {};
    Object.keys(initialShape[rowKey]).forEach(columnKey => {
      movedBlock[rowKey][parseInt(columnKey) - 1] = initialShape[rowKey][columnKey];
    });
  });

  dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(movedBlock)));
};
```

All of this code should look _very_ familiar by now; it's very similar to the code in our `useMoveBlockDown` hook that we went over earlier.

After setting the `'live'` block to the `initialShape` variable, and setting the `movedBlock` variable as an empty object, we loop over the rows of our game board, set an empty object in `movedBlock` at the key of this row, and then loop-over the squares within this row:

```js
Object.keys(initialShape).forEach(rowKey => {
  movedBlock[rowKey] = {};
  Object.keys(initialShape[rowKey]).forEach(columnKey => {
```

The one difference from `useMoveBlockDown`, is that rather than changing adding to the row (which would move the block down), we instead subtract from the column, in order to move the block left (adding to the column would move it right).

```js
movedBlock[rowKey][parseInt(columnKey) - 1] = initialShape[rowKey][columnKey];
```

Once we've finished our loops, the `movedBlock` variable is an object that contains our block, moved one column to the left.

We then call the `updateGameBoard` action, passing-in the return from the `updatedGameBoard` function, to which we pass-in `movedBlock`:

```js
dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(movedBlock)));
```

I won't go over this code again, but to remind you, this will update our `state.squares` in our game board slice (which is our game board). So after running this line, our game board is updated with our moved block.

And with that, we have a pretty good game.

We can move our blocks left, right and down, they automatically move down after an increasingly shorter period of time, any lines that are completed clear, and we keep score of how many lines are cleared and store it in local storage in our browser.

At this point, it's a decent game.

The one thing that I really wanted to add to this unique and original game though, was to be able to rotate the blocks.

I know, I'm a genius for coming up with that idea all on my own.

And this was the part of the development process that had me stumped for the longest time. I was convinced that there was a generic formula I could come up with, that would work on all seven block types to rotate them. So I spent a long time trying to think of one. And I did. It was just a bit buggy.

The problem was really finding the pivot point within the various block shapes and sizes, and there really was nothing generic.

![Blocks](/images/projects/blocks-falling/blocks.jpeg)

An `I` block on it's side pivots at a different point to an `I` block that's vertical, for example. You want to rotate a `T` block from the top of the 'T', but a `Z` and an `S` block from the center.

Also, updating the game board while _rotating_ the `'live'` block was an absolute ball ache.

So what I ultimately ended up doing, was having a _different_ hook, to rotate each of the seven blocks.

Well six. The `O` block doesn't get rotated, because it's just a 2x2 block.

## Rotating blocks

As with other actions in this game, rotating the blocks can be done in one of two ways; either with the keyboard, or with the on-screen buttons.

Assuming that we're using the keyboard, then within the `handleKeyPress()` function of our `GameBoard` component we call the `useRotateBlock` hook:

```js
const handleKeyPress = event => {
  switch (event.key) {
    case 'z':
      event.preventDefault();
      rotateBlock(antiClockwise);
      break;
    case 'x':
      event.preventDefault();
      rotateBlock(clockwise);
      break;
  }
};
```

Welcome to our next hookception.

`clockwise` is simply the string `'clockwise'`, and `antiCLockwise` is `'anti-clockwise'`, so we pass this into our `useRotateBlock` hook, which is as follows:

```js
// src/hooks/use-rotate-block.js

import { useDispatch } from 'react-redux';

import { statusRef, liveBlockRef } from '../components/GameBoard';
import { inProgress, gameBoardActions } from '../store/game-board';
import useRotateIBlock from './use-rotate-i-block';
import useRotateJBlock from './use-rotate-j-block';
import useRotateLBlock from './use-rotate-l-block';
import useRotateSBlock from './use-rotate-s-block';
import useRotateTBlock from './use-rotate-t-block';
import useRotateZBlock from './use-rotate-z-block';
import useUpdatedGameBoard from './use-updated-game-board';

const useRotateBlock = () => {
  const dispatch = useDispatch();
  const rotateIBlock = useRotateIBlock();
  const rotateJBlock = useRotateJBlock();
  const rotateLBlock = useRotateLBlock();
  const rotateSBlock = useRotateSBlock();
  const rotateTBlock = useRotateTBlock();
  const rotateZBlock = useRotateZBlock();
  const updatedGameBoard = useUpdatedGameBoard();
  let rotatedBlock;

  const rotateBlock = (direction = null) => {
    rotatedBlock = null;

    if (statusRef.current === inProgress) {
      if (liveBlockRef.current === 'I') rotatedBlock = rotateIBlock();
      if (liveBlockRef.current === 'J') rotatedBlock = rotateJBlock(direction);
      if (liveBlockRef.current === 'L') rotatedBlock = rotateLBlock(direction);
      if (liveBlockRef.current === 'O') return;
      if (liveBlockRef.current === 'S') rotatedBlock = rotateSBlock();
      if (liveBlockRef.current === 'T') rotatedBlock = rotateTBlock(direction);
      if (liveBlockRef.current === 'Z') rotatedBlock = rotateZBlock();
      if (!rotatedBlock) return;

      dispatch(gameBoardActions.updateGameBoard(updatedGameBoard(rotatedBlock)));
    }
  };

  return rotateBlock;
};

export default useRotateBlock;
```

As you can probably tell from this, each block has its own 'rotate' hook. `useRotateIBlock`, `useRotateJBlock`, `useRotateLBlock` etc. And don't worry, I'm _not_ going to go over each of them.

If you understand one of them, then the rest are fairly similar, so let's stick with what we did earlier, and assume that our `'live'` block is a `J` block.

That means that we hit this line:

```js
if (liveBlockRef.current === 'J') rotatedBlock = rotateJBlock(direction);
```

We then set the return of `rotateJBlock()` to the `rotatedBlock` variable.

Just to clarify why for _some_ blocks we pass-in a rotation `direction`, and for others we don't, the `I`, `S` and `Z` blocks only have two positions.

If you rotate either of these blocks 180°, they're back where they started. So whether or not the player rotates these blocks clockwise or anti-clockwise, it's going to end up the same, so there's no need to check.

With the `J`, `L` and `T` blocks, we don't have this luxury. Rotating them clockwise and anti-clockwise _does_ matter, and returns a different result.

As we're focussing on a `J` block, we call the `useRotateJBlock` hook, and...

Well this isn't a pretty one:

```js
// src/hooks/use-rotate-j-block.js

import useLiveBlockShape from './use-live-block-shape';
import useBlockTopRowKey from './use-block-top-row-key';
import useBlockFirstColumnKey from './use-block-first-column-key';
import useRowKeyIntegers from './use-row-key-integers';
import useOffsetPosition from './use-offset-position';

import { clockwise, live, jBlock } from '../store/game-board';

const useRotateJBlock = () => {
  const liveBlockShape = useLiveBlockShape();
  const blockTopRowKey = useBlockTopRowKey();
  const blockFirstColumnKey = useBlockFirstColumnKey();
  const rowKeyIntegers = useRowKeyIntegers();
  const offsetPosition = useOffsetPosition();

  let returnBlock = {};

  const rotateJBlock = direction => {
    const initialShape = liveBlockShape();

    returnBlock = {};
    const jSquare = { status: live, block: jBlock };

    const topRowKey = blockTopRowKey(initialShape);
    const firstColumnKey = blockFirstColumnKey(initialShape);

    const position = () => {
      if (rowKeyIntegers(initialShape).length === 3) {
        return Object.keys(initialShape[topRowKey]).length === 1 ? '1-1-2' : '2-1-1';
      } else {
        return Object.keys(initialShape[topRowKey]).length === 3 ? '3-1' : '1-3';
      }
    };

    const build1_1_2Block = (firstRow, firstColumn) => {
      [...Array(3)].forEach((_, index) => {
        returnBlock[firstRow + index] = {};
        if (index === 0) returnBlock[firstRow][firstColumn + 1] = jSquare;
        if (index === 1) returnBlock[firstRow + index][firstColumn + 1] = jSquare;
        if (index === 2) {
          returnBlock[firstRow + index][firstColumn] = jSquare;
          returnBlock[firstRow + index][firstColumn + 1] = jSquare;
        }
      });
    };

    const build2_1_1Block = (firstRow, firstColumn) => {
      [...Array(3)].forEach((_, index) => {
        returnBlock[firstRow + index] = {};
        if (index === 0) {
          returnBlock[firstRow][firstColumn] = jSquare;
          returnBlock[firstRow][firstColumn + 1] = jSquare;
        }
        if (index === 1) returnBlock[firstRow + index][firstColumn] = jSquare;
        if (index === 2) returnBlock[firstRow + index][firstColumn] = jSquare;
      });
    };

    const build3_1Block = (firstRow, firstColumn) => {
      [...Array(2)].forEach((_, index) => {
        returnBlock[firstRow + index] = {};
        if (index === 0) {
          returnBlock[firstRow][firstColumn] = jSquare;
          returnBlock[firstRow][firstColumn + 1] = jSquare;
          returnBlock[firstRow][firstColumn + 2] = jSquare;
        }
        if (index === 1) returnBlock[firstRow + index][firstColumn + 2] = jSquare;
      });
    };

    const build1_3Block = (firstRow, firstColumn) => {
      [...Array(2)].forEach((_, index) => {
        returnBlock[firstRow + index] = {};
        if (index === 0) returnBlock[firstRow][firstColumn] = jSquare;
        if (index === 1) {
          returnBlock[firstRow + index][firstColumn] = jSquare;
          returnBlock[firstRow + index][firstColumn + 1] = jSquare;
          returnBlock[firstRow + index][firstColumn + 2] = jSquare;
        }
      });
    };

    if (position() === '1-1-2') {
      direction === clockwise
        ? build1_3Block(topRowKey, firstColumnKey)
        : build3_1Block(topRowKey + 1, firstColumnKey);
    } else if (position() === '2-1-1') {
      direction === clockwise
        ? build3_1Block(topRowKey + 1, firstColumnKey - 1)
        : build1_3Block(topRowKey, firstColumnKey - 1);
    } else if (position() === '3-1') {
      direction === clockwise
        ? build1_1_2Block(topRowKey - 1, firstColumnKey)
        : build2_1_1Block(topRowKey - 1, firstColumnKey + 1);
    } else {
      direction === clockwise
        ? build2_1_1Block(topRowKey, firstColumnKey + 1)
        : build1_1_2Block(topRowKey, firstColumnKey);
    }

    if (offsetPosition(returnBlock)) {
      return returnBlock;
    }

    return false;
  };

  return rotateJBlock;
};

export default useRotateJBlock;
```

It doesn't look that fun at first glance, but once you've got a grasp of what's going on here, this hook is actually fairly simple.

And the sooner we start, the sooner we'll finish, so let's get it over with.

The first three lines should look familiar:

```js
const initialShape = liveBlockShape();

returnBlock = {};
const jSquare = { status: live, block: jBlock };
```

As we already know, `liveBlockShape()` sets our current `'live'` block to the `initialShape` variable. Then `live` is simply the string `'live'`, and `jBlock` is simply the string `'j-block'`, so our `jSquare` variable is set to:

```js
{
  status: `live`,
  block: 'j-block',
}
```

On the next line, we get to `const topRowKey = blockTopRowKey(initialShape);`, which calls our `useBlockTopRowKey` hook.

And guess what? This hook doesn't actually call any other hooks, so that's a nice surprise. In fact, `useBlockTopRowKey` is pretty simple:

```js
// src/hooks/use-block-top-row-key.js

const useBlockTopRowKey = () => {
  const blockTopRowKey = block => parseInt(Object.keys(block)[0]);

  return blockTopRowKey;
};

export default useBlockTopRowKey;
```

We pass-in our `initialShape` variable to this hook, and name it `block`. Then all we do, is fetch the first key from this block with `Object.keys(block)[0]`, make it an integer with `parseInt` and return it.

So going back to our `useRotateJBlock` hook, when we have

```js
const topRowKey = blockTopRowKey(initialShape);
```

`topRowKey` is going to be set to an integer that is the top row of our `'live'` block.

On the next line, we call another hook; this time the `useBlockFirstColumnKey` hook:

```js
const firstColumnKey = blockFirstColumnKey(initialShape);
```

And guess what? This hook doesn't call any other hooks either.

Just kidding, that would be way too easy, but it only calls one, so it could be worse:

```js
// src/hooks/use-block-first-column-key.js

import useColumnKeyIntegers from './use-column-key-integers';

const useBlockFirstColumnKey = () => {
  const columnKeyIntegers = useColumnKeyIntegers();

  const blockFirstColumnKey = block => Math.min(...columnKeyIntegers(block));

  return blockFirstColumnKey;
};

export default useBlockFirstColumnKey;
```

The `useColumnKeyIntegers` hook does exactly what it says on the tin, and returns the column keys of the block that we pass it; in this case our current block:

```js
// src/hooks/use-column-key-integers.js

const useColumnKeyIntegers = () => {
  const columnKeyIntegers = block => {
    let columnsArray = [];

    Object.keys(block).forEach(rowKey => columnsArray.push(Object.keys(block[rowKey])));

    return [...new Set(columnsArray.flat().map(column => parseInt(column)))];
  };

  return columnKeyIntegers;
};

export default useColumnKeyIntegers;
```

In this hook, the `Object.keys(block).forEach(rowKey => columnsArray.push(Object.keys(block[rowKey])));` line loops over all the rows in our block, then within each loop, we `push` the return of `Object.keys(block[rowKey])` (which is all of the column keys within each row) to our `columnsArray` variable.

Assuming that we have a `J` block that's horizonal and with the curve of the 'J' pointing upwards, then `columnsArray` will be:

```js
[['4'], ['4', '5', '6']];
```

On the next line, we run `columnsArray.flat().map(column => parseInt(column))`, which firstly flattens `columnsArray` (so it becomes `['4', '4', '5', '6']`), then map-over this array, changing the string values to integers with `parseInt` (so it becomes `[4, 4, 5, 6]`).

The `Set` function ensures that each value is unique, so when we pass `[4, 4, 5, 6]` to `Set`, it becomes `[4, 5, 6]` (set requires the `new`).

So what we end up returning here, is a unique array of integers, for the columns that our `'live'` block currently occupies; in our example, we return `[4, 5, 6]`:

```js
return [...new Set(columnsArray.flat().map(column => parseInt(column)))];
```

Back in our `useBlockFirstColumnKey`, this return value is set to the `columnKeyIntegers` variable:

```js
const columnKeyIntegers = useColumnKeyIntegers();
```

We then use `Math.min` to fetch the _lowest_ of these integers, and set it to the `blockFirstColumnKey` variable, which is what we return from our `useBlockFirstColumnKey` hook:

```js
const blockFirstColumnKey = block => Math.min(...columnKeyIntegers(block));
```

In our example from above where the `useColumnKeyIntegers` returns `[4, 5, 6]`, then `useBlockFirstColumnKey` returns `4`.

If I was being clearer with the name of this hook, it would be called something like `useBlockFurthestLeftColumnKey`, but that's kind of ugly, so I just used 'first' here to mean furthest left.

Back in our `useRotateJBlock` hook, the return from `useBlockFirstColumnKey` (so `4`) is set to the `firstColumnKey` variable:

```js
const firstColumnKey = blockFirstColumnKey(initialShape);
```

So remember that at this point, `topRowKey` is set to the highest row that our `'live'` block occupies, and `firstColumnKey` is set to the furthese left column that our `'live'` block occupies.

The next part of our `useRotateJBlock` hook that we hit is this sexy `if` statement:

```js
if (position() === '1-1-2') {
  direction === clockwise
    ? build1_3Block(topRowKey, firstColumnKey)
    : build3_1Block(topRowKey + 1, firstColumnKey);
} else if (position() === '2-1-1') {
  direction === clockwise
    ? build3_1Block(topRowKey + 1, firstColumnKey - 1)
    : build1_3Block(topRowKey, firstColumnKey - 1);
} else if (position() === '3-1') {
  direction === clockwise
    ? build1_1_2Block(topRowKey - 1, firstColumnKey)
    : build2_1_1Block(topRowKey - 1, firstColumnKey + 1);
} else {
  direction === clockwise
    ? build2_1_1Block(topRowKey, firstColumnKey + 1)
    : build1_1_2Block(topRowKey, firstColumnKey);
}
```

Isn't she gorgeous?

And the first thing we do here is call our `position()` function.

What this function does, is return a string that represents the current _rotation_ position of our `'live'` block:

```js
const position = () => {
  if (rowKeyIntegers(initialShape).length === 3) {
    return Object.keys(initialShape[topRowKey]).length === 1 ? '1-1-2' : '2-1-1';
  } else {
    return Object.keys(initialShape[topRowKey]).length === 3 ? '3-1' : '1-3';
  }
};
```

We return one of four values from this function: `'1-1-2'`, `'2-1-1'`, `'3-1'` or `'1-3'`. And yes, you may be wondering what on earth is going on.

This is a system that I devised to identify a block's rotation. And how it works, is that each number in this string represents a row of the block, going from top to bottom.

So for example, in `1-1-2`, the first `1` represents the top row of our block, the second `1` represents the second row of our block, and `2` represents the third row of our block.

The value of the number says how many squares on that row the block occupies. So again using `1-1-2`, on the first row there is 1 square, on the second row there is 1 square, and on the third row there are 2 squares.

Based on this being the `J` block, we can therefore deduce that the blocks rotational position is:

![1-1-2](/images/projects/blocks-falling/1-1-2.png)
_1-1-2_

Now that we know what the possible returns from `position()` mean, then all we've got to do is figure-out which of those four positions our block is in:

```js
const position = () => {
  if (rowKeyIntegers(initialShape).length === 3) {
    return Object.keys(initialShape[topRowKey]).length === 1 ? '1-1-2' : '2-1-1';
  } else {
    return Object.keys(initialShape[topRowKey]).length === 3 ? '3-1' : '1-3';
  }
};
```

We use another hook here: `useRowKeyIntegers`, passing-in our block.

The `useRowKeyIntegers` hook is pretty simple:

```js
// src/hooks/use-row-key-integers.js

const useRowKeyIntegers = () => {
  const rowKeyIntegers = block => Object.keys(block).map(rowKey => parseInt(rowKey));

  return rowKeyIntegers;
};

export default useRowKeyIntegers;
```

It takes our block, maps over the rows, and returns them as an array integers.

Back in the `position()` function, we firstly check if the `length` of the return from our `useRowKeyIntegers` hook is `3`:

```js
if (rowKeyIntegers(initialShape).length === 3) {
```

We do this because if the block has three rows, then we know that the `J` is vertical (so will be either `'1-1-2'` or `'2-1-1'`), if it doesn't have three rows (in which case, it'll have two), we know that it's horizontal (so will be either `'3-1'` or `'1-3`).

In both cases, to determine which string to return, we use `Object.keys(initialShape[topRowKey]).length`. This gives us the number of keys (so the number of columns) in the top row of our block.

If our block is vertical and it has one column in the top row, then we know it's `'1-1-2'`, if not then it _has to_ be `'2-1-1'`. If it's vertical and it has three columns in the top row, then we know it's `3-1`, if not then it _has to_ be `'1-3'`.

So by calling `position()`, we're able to determine the current rotational position of our `'live'` block.

And if you remember back to the `if` statement where we called `position()`, we take different actions depending on which position our block is in, and which direction we want to rotate it:

```js
if (position() === '1-1-2') {
  direction === clockwise
    ? build1_3Block(topRowKey, firstColumnKey)
    : build3_1Block(topRowKey + 1, firstColumnKey);
} else if (position() === '2-1-1') {
  direction === clockwise
    ? build3_1Block(topRowKey + 1, firstColumnKey - 1)
    : build1_3Block(topRowKey, firstColumnKey - 1);
} else if (position() === '3-1') {
  direction === clockwise
    ? build1_1_2Block(topRowKey - 1, firstColumnKey)
    : build2_1_1Block(topRowKey - 1, firstColumnKey + 1);
} else {
  direction === clockwise
    ? build2_1_1Block(topRowKey, firstColumnKey + 1)
    : build1_1_2Block(topRowKey, firstColumnKey);
}
```

Let's assume here, that the current `position()` of our `'live'` block is `'1-1-2'`, and that the player wants to rotate the block `clockwise`, then based on this `if` statement, we're going to call the `build1_3Block()` function.

What does that mean?

Well it's no coincidence that these function names use the same `1-1-2`, `2-1-1`, `3-1` and `1-3` system that we use to identify the rotational position of our blocks.

Our block is currently in the `'1-1-2'` position:

![1-1-2](/images/projects/blocks-falling/1-1-2.png)
_1-1-2_

But if we rotate it clockwise, then it's going to move into the `'1-3'` position:

![1-3](/images/projects/blocks-falling/1-3.png)
_1-3_

And yes, before you say it that is the same screenshot at a 90° angle to save me having to take another one.

So what the `build1_3Block()` function does is build a block in the `'1-3'` position, and it does this taking-in two arguments; `firstRow` and `firstColumn`:

```js
const build1_3Block = (firstRow, firstColumn) => {
  [...Array(2)].forEach((_, index) => {
    returnBlock[firstRow + index] = {};
    if (index === 0) returnBlock[firstRow][firstColumn] = jSquare;
    if (index === 1) {
      returnBlock[firstRow + index][firstColumn] = jSquare;
      returnBlock[firstRow + index][firstColumn + 1] = jSquare;
      returnBlock[firstRow + index][firstColumn + 2] = jSquare;
    }
  });
};
```

`firstRow` and `firstColumn` state, for our newly rotated block, which the top row will be, and which the column furthest to the left will be.

In the current method call that we're looking at, where our current block is `'1-1-2'`, then we keep the same `firstRow` and `firstColumn` values that we currently have:

```js
build1_3Block(topRowKey, firstColumnKey);
```

(remember how we set `topRowKey` and `firstColumnKey` earlier?)

However, in some instances, depending on the point on which we want to pivot our block, these values are offset slightly, for example:

```js
} else if (position() === '3-1') {
  direction === clockwise
    ? build1_1_2Block(topRowKey - 1, firstColumnKey)
    : build2_1_1Block(topRowKey - 1, firstColumnKey + 1);
```

In the case of rotating anti-clockwise from a `'3-1'` block, we want the top row of our block to be one higher than our current row, and the first column to be one further to the right:

```js
build2_1_1Block(topRowKey - 1, firstColumnKey + 1);
```

This is because the pivot point I chose for the `J` block was the middle square in the stalk of the 'J'. And going from a `'3-1'` position to a `'2-1-1'` position while using _this_ pivot point, the top row has to be one higher, and the first column one to the right.

For our example of the `'1-1-2'` block rotating clockwise to the `'1-3'` position however, rotating on this pivot point, the top row and first column remain the same.

So by the time we get to the `build1_3Block()` function, we know the placement of our rotated block in our grid, as we pass it in as `firstRow` and `firstColumn` arguments, so all we have to do now, is rotate the block and put it in the correct place:

```js
const build1_3Block = (firstRow, firstColumn) => {
  [...Array(2)].forEach((_, index) => {
    returnBlock[firstRow + index] = {};
    if (index === 0) returnBlock[firstRow][firstColumn] = jSquare;
    if (index === 1) {
      returnBlock[firstRow + index][firstColumn] = jSquare;
      returnBlock[firstRow + index][firstColumn + 1] = jSquare;
      returnBlock[firstRow + index][firstColumn + 2] = jSquare;
    }
  });
};
```

All the `[...Array(2)]` does, is return an array with two `undefined` elements, for example:

```js
[undefined, undefined];
```

We do this, because as we know that we're building a `'1-3'` block, then we need to build two rows, so want to run our `forEach` loop two times.

It's worth remembering at this point that `returnBlock` was set to an empty object, earlier in this hook:

```js
let returnBlock = {};
```

So when we run `returnBlock[firstRow + index] = {};`, we're just setting the row key.

`if (index === 0)` checks if we're building the first row of our rotated block. If we are, then we simply set the square at `firstColumn` to equal `jSquare`.

```js
if (index === 0) returnBlock[firstRow][firstColumn] = jSquare;
```

Remember that this is the block we're building:

![1-3](/images/projects/blocks-falling/1-3.png)
_1-3_

On both rows, the column furthest to the left is occupied, which is why we can just use `firstColumn` without any additions.

Once we get onto the second row of our new block, we have three squares that we want occupied, so for this row we run:

```js
if (index === 1) {
  returnBlock[firstRow + index][firstColumn] = jSquare;
  returnBlock[firstRow + index][firstColumn + 1] = jSquare;
  returnBlock[firstRow + index][firstColumn + 2] = jSquare;
}
```

So at this point what we have, is our `returnBlock` object set with how we want our rotated block to be.

All done, right?

Yeah, not so fast.

Sadly, there are several scenrios where it's not possible to rotate a block. The rotated block may be outside of the game board, or it may be in a position that already has a `'settled'` block, so what do we do then?

Well glad you asked. Things are about to get quite hooky again.

There's this very inconspicuous code at the bottom of the `useRotateJBlock` hook:

```js
if (offsetPosition(returnBlock)) {
  return returnBlock;
}

return false;
```

That can't be so bad, can it?

These are the two values that it's possible to return from `useRotateJBlock`. Either we return `returnBlock` from within this `if` check, otherwise we return `false`.

Returning `false` simply means that there's no possible way that we can rotate this block. For example, if a vertical `J` block is in this situation:

![Trapped J](/images/projects/blocks-falling/trapped-j.png)

There is no way that the (yellow) `J` block can rotate here, because to rotate it needs to take up three columns. However, in its current position, there is nowhere it can move to have three columns.

In this situation, we would simply return `false` from `useRotateJBlock`, meaning we cannot rotate this block, so don't even bother trying.

We will only do this, _after_ trying all several remedies though. And they're all handled by the `useOffsetPosition` hook, which we call here:

```js
if (offsetPosition(returnBlock)) {
  return returnBlock;
}
```

And you remember how I said it was going to get a bit hooky?

```js
// src/hooks/use-offset-position.js

import useOffsetForTopOfGameBoard from './use-offset-for-top-of-game-board';
import useOffsetForBottomOfGameBoard from './use-offset-for-bottom-of-game-board';
import useOffsetForLeftOfGameBoard from './use-offset-for-left-of-game-board';
import useOffsetForRightOfGameBoard from './use-offset-for-right-of-game-board';
import useOffsetForOtherBlocks from './use-offset-for-other-blocks';

const useOffsetPosition = () => {
  const offsetForTopOfGameBoard = useOffsetForTopOfGameBoard();
  const offsetForBottomOfGameBoard = useOffsetForBottomOfGameBoard();
  const offsetForLeftOfGameBoard = useOffsetForLeftOfGameBoard();
  const offsetForRightOfGameBoard = useOffsetForRightOfGameBoard();
  const offsetForOtherBlocks = useOffsetForOtherBlocks();

  const offsetForGameBoard = block => {
    offsetForTopOfGameBoard(block);
    offsetForBottomOfGameBoard(block);
    offsetForLeftOfGameBoard(block);
    offsetForRightOfGameBoard(block);
  };

  const offsetPosition = block => {
    offsetForGameBoard(block);
    return offsetForOtherBlocks(block);
  };

  return offsetPosition;
};

export default useOffsetPosition;
```

Everything that the `useOffsetPosition` hook does, involves other hooks, so if you thought we were getting to the end...

Remember that the `block` argument here is the `returnBlock` variable from our `useRotateJBlock` hook; it is the position that we _want_ to put our rotated block.

The first thing that we do in this hook is call the `offsetForGameBoard();` function, which in turns calls four hooks:

```js
const offsetForGameBoard = block => {
  offsetForTopOfGameBoard(block);
  offsetForBottomOfGameBoard(block);
  offsetForLeftOfGameBoard(block);
  offsetForRightOfGameBoard(block);
};
```

As you can probably tell by the names, these four hooks check whether `block` will be outside of the game board, and if it will, it shifts the block down/up/right/left accordingly.

These four hooks are all _fairly_ similar, and each one calls three more hooks. So for all our benefits, I'll just go over one of them: `useOffsetForLeftOfGameBoard`.

```js
// src/hooks/use-offset-for-left-of-game-board.js

import useColumnIsLeftOfGameBoard from './use-column-is-left-of-game-board';
import useBlockFirstColumnKey from './use-block-first-column-key';
import useShiftBlockRight from './use-shift-block-right';

const useOffsetForLeftOfGameBoard = () => {
  const columnIsLeftOfGameBoard = useColumnIsLeftOfGameBoard();
  const blockFirstColumnKey = useBlockFirstColumnKey();
  const shiftBlockRight = useShiftBlockRight();

  const offsetForLeftOfGameBoard = block => {
    if (!columnIsLeftOfGameBoard(block)) return;

    const amountToShift = 0 - blockFirstColumnKey(block) + 1;

    shiftBlockRight(block, amountToShift);
  };

  return offsetForLeftOfGameBoard;
};

export default useOffsetForLeftOfGameBoard;
```

And the first thing we do in this hook, is obviously call another hook: `useColumnIsLeftOfGameBoard`.

As the name suggests, this simply returns `true` or `false`, depending on if the block is off to the left of the game board or not.

```js
// src/hooks/use-column-is-left-of-game-board.js

import useBlockFirstColumnKey from './use-block-first-column-key';

const useColumnIsLeftOfGameBoard = () => {
  const blockFirstColumnKey = useBlockFirstColumnKey();

  const columnIsLeftOfGameBoard = block => blockFirstColumnKey(block) < 1;

  return columnIsLeftOfGameBoard;
};

export default useColumnIsLeftOfGameBoard;
```

And guess what? The first thing it does is call another hook. Thankfully, we've already been over the `useBlockFirstColumnKey` hook. That was the one that gets the first (furthest left) column in the block that we pass-into it.

So we fetch this column, and simply check whether it is less than `1`.

```js
blockFirstColumnKey(block) < 1;
```

If it is less than one, we return `true`, as in the column _is_ left of the game board, otherwise we call false.

Back in `useOffsetForLeftOfGameBoard`, if the new block is not to the left of the game board, we simply return:

```js
if (!columnIsLeftOfGameBoard(block)) return;
```

However, if it is outside the left boundary, we continue and the next line we run is:

```js
const amountToShift = 0 - blockFirstColumnKey(block) + 1;
```

The `useBlockFirstColumnKey` hook we went over about 10 seconds ago, so don't even ask. Here, because the block is off to the left of the game board, it is going to return `0` or a negative number. So when we run `0 - blockFirstColumnKey(block)`, it gives us the distance that our new block is _outside_ of our game board boundaries.

We then take this value and `+ 1`, meaning that `amountToShift` is the amount that we have to move our block to the right so that it is within our game board boundaries.

Lastly in the `useOffsetForLeftOfGameBoard` hook, we call `shiftBlockRight(block, amountToShift);`, which I'm sure you'll be surprised to hear, is another hook. Which calls more hooks:

```js
// src/hooks/use-shift-block-right.js

import useRowKeyIntegers from './use-row-key-integers';
import useRenameColumnKey from './use-rename-column-key';

const useShiftBlockRight = () => {
  const rowKeyIntegers = useRowKeyIntegers();
  const renameColumnKey = useRenameColumnKey();

  const shiftBlockRight = (block, amount = 1) => {
    rowKeyIntegers(block).forEach(rowKey =>
      Object.keys(block[rowKey])
        .reverse()
        .forEach(columnKey => {
          renameColumnKey(block, rowKey, parseInt(columnKey), parseInt(columnKey) + amount);
        })
    );
  };

  return shiftBlockRight;
};

export default useShiftBlockRight;
```

The `useRowKeyIntegers` hook we've been over already. It's the one that returns the `block` rows as an array of integers.

`useRenameColumnKey` is new.

And what we're doing here, just for a change, is looping-over the rows of our `block` with:

```js
rowKeyIntegers(block).forEach(rowKey =>
```

Within this loop, we then get the column keys for each row:

```js
Object.keys(block[rowKey]);
```

Crucially though, we `.reverse()` them. This is because, as we're shifting the block to the right, we need to move the squares from the right first. If we moved them from the left, then in the next iteration, we'd be looking as squares which we'd already moved, and would just end up with a massive block that went on forever. And that's not as cool as it sounds.

We then run a loop on all of the squares, and for _each_ square call the `useRenameColumnKey` hook:

```js
renameColumnKey(block, rowKey, parseInt(columnKey), parseInt(columnKey) + amount);
```

As you may be able to tell from the name, `useRenameColumnKey` renames the columns in the `block` that you pass it.

```js
// src/hooks/use-rename-column-key.js

const useRenameColumnKey = () => {
  const renameColumnKey = (block, rowKey, oldKey, newKey) => {
    delete Object.assign(block[rowKey], { [newKey]: block[rowKey][oldKey] })[oldKey];
  };

  return renameColumnKey;
};

export default useRenameColumnKey;
```

It's a slightly confusing one to look at, so let me try and explain exactly what's going on here.

Firstly, `Object.assign` copies all the properties from multiple objects and merges them into one object, for example:

```js
let obj1 = { name: 'Jethro' };
let obj2 = { age: 21 };

console.log(Object.assign(obj1, obj2)); // { name: 'Jethro', age: 21 }
```

So when we look at this line within `useRenameColumnKey`

```js
Object.assign(block[rowKey], { [newKey]: block[rowKey][oldKey] });
```

we can see that we're passing it two different objects: `block[rowKey]` and `{ [newKey]: block[rowKey][oldKey] }`. `Object.assign()` will then merge them together.

Remember that `block` here is our rotated block; the block that we _want_ to return. We also passed-in the `rowKey` that we're looking at here. So `block[rowKey]` is an object of all the columns on this row of the block.

`{ [newKey]: block[rowKey][oldKey] }` is the specific square that we're looking at. The key is the `newKey` (column) that we want to move this square to, and the value is equal to the square on the same row, but at `oldKey`.

So what we do by passing these two objects to `Object.assign()`, is pass-in the old row, but overwrite the value at `newKey` _with_ what we want there once the block has shifted.

This is where `delete` comes into play:

```js
delete Object.assign(block[rowKey], { [newKey]: block[rowKey][oldKey] })[oldKey];
```

At this point, we still need to `delete` the key/value of our `oldKey` that we've now moved to a different square, and that's exactly what `delete` does; it removes a key/value from an object.

Specifically, we `delete` the value at `[oldKey]` in our `Object.assign(block[rowKey], { [newKey]: block[rowKey][oldKey] })`.

Now remember that we're calling `useRenameColumnKey` as part of a loop over each of the squares in our block:

```js
const shiftBlockRight = (block, amount = 1) => {
  rowKeyIntegers(block).forEach(rowKey =>
    Object.keys(block[rowKey])
      .reverse()
      .forEach(columnKey => {
        renameColumnKey(block, rowKey, parseInt(columnKey), parseInt(columnKey) + amount);
      })
  );
};
```

Each time we call `renameColumnKey()` we're moving one square over to the right, and deleting the old square from `block`, so once we've finished this loop, our entire block has moved to _within_ our game board.

Calling the `useShiftBlockRight` hook was the last action of our `useOffsetForLeftOfGameBoard` hook, which takes us back to `useOffsetPosition`:

```js
// src/hooks/use-offset-position.js

import useOffsetForTopOfGameBoard from './use-offset-for-top-of-game-board';
import useOffsetForBottomOfGameBoard from './use-offset-for-bottom-of-game-board';
import useOffsetForLeftOfGameBoard from './use-offset-for-left-of-game-board';
import useOffsetForRightOfGameBoard from './use-offset-for-right-of-game-board';
import useOffsetForOtherBlocks from './use-offset-for-other-blocks';

const useOffsetPosition = () => {
  const offsetForTopOfGameBoard = useOffsetForTopOfGameBoard();
  const offsetForBottomOfGameBoard = useOffsetForBottomOfGameBoard();
  const offsetForLeftOfGameBoard = useOffsetForLeftOfGameBoard();
  const offsetForRightOfGameBoard = useOffsetForRightOfGameBoard();
  const offsetForOtherBlocks = useOffsetForOtherBlocks();

  const offsetForGameBoard = block => {
    offsetForTopOfGameBoard(block);
    offsetForBottomOfGameBoard(block);
    offsetForLeftOfGameBoard(block);
    offsetForRightOfGameBoard(block);
  };

  const offsetPosition = block => {
    offsetForGameBoard(block);
    return offsetForOtherBlocks(block);
  };

  return offsetPosition;
};

export default useOffsetPosition;
```

## Useful links

<!-- TODO -->
