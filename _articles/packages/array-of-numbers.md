---
title: 'array-of-numbers'
description: 'An npm package that returns an array of integers based on three arguments.'
coverImage: '/images/packages/array-of-numbers/npm-screenshot.png'
published: '2022-04-29' # TODO - Update this
tags: 'npm, JavaScript'
---

Whilst writing the code for [Blocks Falling](https://blocksfalling.com/), I needed some arrays of integers. I found the syntax to create them to be a little unclean, and that there was no uniform way to create an array of integers with varying starting numbers and increments, so I created this package to do exactly that.

This package returns an array of integers, based on three optional arguments:

- startingNumber (default is 1)
- amountOfNumbers (default is 10)
- increment (default is 1)

## Code

The code to do this is very simple, but it took me a minute to figure out, so here it is to save you having to think:

<!-- prettier-ignore -->
```js
const arrayOfNumbers = (startingNumber = 1, amountOfNumbers = 10, increment = 1) =>
  Array.from(new Array(amountOfNumbers), (_, i) => (i + startingNumber) + (i * (increment - 1)))
```

## Setup

Alternatively, it can be installed as an npm package with:

```
npm install array-of-numbers
```

You can then import it into your project with:

```js
import arrayOfNumbers from 'array-of-numbers';
```

## Examples

The `startingNumber` and `increment` arguments can be any integer. `amountOfNumbers` must be a positive integer (if a negative integer is passed-in, it will throw an error).

```js
import arrayOfNumbers from 'array-of-numbers';

console.log(arrayOfNumbers()); // [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]

console.log(arrayOfNumbers(5)); // [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]
console.log(arrayOfNumbers(-3)); // [ -3, -2, -1, 0, 1, 2, 3, 4, 5, 6 ]

console.log(arrayOfNumbers(1, 5)); // [ 1, 2, 3, 4, 5 ]
console.log(arrayOfNumbers(3, 8)); // [ 3, 4, 5, 6, 7, 8, 9, 10 ]
console.log(arrayOfNumbers(-20, 15)); // [ -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6 ]

console.log(arrayOfNumbers(1, 10, 3)); // [ 1, 4, 7, 10, 13, 16, 19, 22, 25, 28 ]
console.log(arrayOfNumbers(10, 8, 5)); // [ 10, 15, 20, 25, 30, 35, 40, 45 ]
console.log(arrayOfNumbers(-3, 5, -5)); // [ -3, -8, -13, -18, -23 ]
console.log(arrayOfNumbers(-8, 12, 10)); // [ -8, 2, 12, 22, 32, 42, 52, 62, 72, 82, 92, 102 ]
console.log(arrayOfNumbers(100, 10, -5)); // [ 100, 95, 90, 85, 80, 75, 70, 65, 60, 55 ]
```

## Useful links

- array-of-numbers GitHub repo - [https://github.com/jro31/array-of-numbers](https://github.com/jro31/array-of-numbers)
- array-of-numbers npm page - [https://www.npmjs.com/package/array-of-numbers](https://www.npmjs.com/package/array-of-numbers)
