---
title: 'random-element-selector'
description: 'An npm package to randomly select one element from an array.'
coverImage: '/images/packages/random-element-selector/npm-screenshot.png'
published: '2022-05-05'
tags: 'npm, JavaScript'
---

This package solves none of the world's problems, and has very little reason to exist. However, it does enable you to neaten-up your code very slightly if you need to fetch a random element from an array in multiple places.

I was looking for an excuse to create a new npm package, so that was good enough for me.

In the simplest... and most complicated terms, this package returns _one_ element from the array that you pass it.

If you don't pass it an array, or pass it something that's not an array, it'll throw an error.

## Code

<!-- prettier-ignore -->
```js
const randomElementSelector = (array) => array[Math.floor(Math.random() * array.length)];
```

That's literally it.

To break-down this code, `Math.random()` generates a random float between 0 and 1 (but not including 1), for example:

```js
console.log(Math.random()); // 0.53249857713625
```

We then multiply this by the length of our array, for example if our array is

```js
const array = [1, 2, 3, 4, 5];
```

then we would do

```js
0.53249857713625 * 5;
```

That's `2.6624928856812504` for those of you who aren't very good at maths.

`Math.floor()` then rounds this float down to the nearest whole number, so in this example `Math.floor(Math.random() * array.length)` is equivalent to

```js
Math.floor(2.6624928856812504);
```

which returns `2` (I hope you got that one at least).

We then return the element in our array at _this_ index. So from the array `[1, 2, 3, 4, 5]` we would return `3`.

Putting that all together:

<!-- prettier-ignore -->
```js
const myArray = [1, 2, 3, 4, 5]
const randomElementSelector = (array) => array[Math.floor(Math.random() * array.length)];

console.log(randomElementSelector(myArray)) // 3
```

## Setup

This code is simple enough it can be copied directly into your project, but to use it as a package, install it with

```
npm install random-element-selector
```

and then import it into your project, for example:

```js
import randomElement from 'random-element-selector';
```

## Examples

```js
import randomElement from 'random-element-selector';

const myArray = [3, 'cat', 'didgeridoo', { hello: 'World' }, 999];
console.log(randomElement(myArray)); // 'didgeridoo'
console.log(randomElement(myArray)); // 999
console.log(randomElement(myArray)); // { hello: 'World' }
console.log(randomElement(myArray)); // 999
console.log(randomElement(myArray)); // 3
console.log(randomElement(myArray)); // 3
console.log(randomElement(myArray)); // 'cat'
```

## Useful links

- random-element-selector GitHub repo - [https://github.com/jro31/random-element-selector](https://github.com/jro31/random-element-selector)
- random-element-selector npm page - [https://www.npmjs.com/package/random-element-selector](https://www.npmjs.com/package/random-element-selector)
