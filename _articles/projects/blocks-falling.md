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

The `'empty'` values above, represent the status of that "square"; we'll go over that in more detail in a moment. The second value is the name of the block (although being initially empty, that is why it is an empty string).

And what I quickly found, was that keeping track of and updating all of these values while using array indexes of arrays nested three-deep was a God-awful process.

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

`reduce` returns a single value. In this case, that single value just so happens to be a rather large object.

`reduce` loops over all the elements of the array that it's called on. `acc` (short for 'accumulator') is the accumulated value to be returned, after that iteration. `curr` (short for 'current'), is the current element from the array that we're iterating over.

Confused?

Yeah, I have that affect on people.

Let's look at a simpler example:

```js
[1, 2, 3, 4].reduce((acc, curr) => acc + curr);
```

Here, we're looping over this array. As we haven't passed-in a starting value, our `acc` starts at zero. So on the first iteration, where `acc` is zero, `curr` (the first element in our array) is `1`. So `0 + 1`, we return `1`.

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

With `acc[curr] = { status: 'empty' }` we therefore set a key of `2`, and give it a value of `{ status: 'empty' }`. We return this updated object, so our return from our second iteration is `{ '1': { status: 'empty' }, '2': { status: 'empty' } }`.

In our third iteration, `acc` is therefore set to `{ '1': { status: 'empty' }, '2': { status: 'empty' } }`, and `curr` is set to `3`, so from this iteration we return `{ '1': { status: 'empty' }, '2': { status: 'empty' }, '3': { status: 'empty' } }`.

On our final iteration, `acc` is set to `{ '1': { status: 'empty' }, '2': { status: 'empty' }, '3': { status: 'empty' } }`, with `curr` being set to `4`.

After this final iteration, what we return from this function is `{ '1': { status: 'empty' }, '2': { status: 'empty' }, '3': { status: 'empty' }, '4': { status: 'empty' } }`.

Now let's go back to our full `emptyRow` variable:

<!-- prettier-ignore -->
```js
export const emptyRow = arrayOfNumbers().reduce((acc, curr) => ((acc[curr] = { status: empty, block: '' }), acc), {});
```

Here, `arrayOfNumbers` is `[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]`, and `empty` is set to `'empty'`. So when we run our `reduce` function, what is returned is:

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

So that is it; that is our game board. It's 210 squares, organised by row, where each has a `status` and a `block` attribute. And in order for the game to work, all we have to do is keep track of all 210 squares, and update them based on the player's actions, and automated actions.

Simple, right?

## Backgrounds

<!-- TODO -->

## Useful links

<!-- TODO -->
