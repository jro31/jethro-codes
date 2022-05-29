---
title: 'filter-object-by-keys'
description: 'An npm package that reduces an object to just the required keys.'
coverImage: '/images/packages/filter-object-by-keys/npm-screenshot.png'
published: '2022-05-29'
tags: 'npm, JavaScript'
---

This package accepts an object and an array of keys, and returns a new object of _just_ the keys contained in the array.

It has two required arguments and one optional argument:

- `object` - The object to be reduced.
- `keys` - An array of keys to be returned in the new object.
- `throwError` (optional) - Defaults to `true`.
  - If `true`, an error will be thrown if a key which is **not** present in the `object`, is contained in the `keys` array.
  - If `false`, no error will be thrown, and the key which is not present in the `object` will be included in the return with a value of `undefined`.

## Code {#code}

This package consists of one main `filterObject` function, accepting the three arguments listed above:

```js
const filterObject = (object, keys, throwError = true) => {
  let returnObj = {};

  if (throwError && !keys.every(key => Object.keys(object).includes(key))) {
    throw new Error(`Unrecognised key passed to filter-object-by-keys`);
  }

  keys.map(key => {
    returnObj[key] = object[key];
  });

  return returnObj;
};
```

`returnObject` is what we eventually return from this function, and it starts as an empty object:

```js
let returnObj = {};
```

In the next part of this function we check whether `throwError` is `true`. We then check for any key contained within the `keys` array that is **not** present as a key in the `object` argument. If both of these return `true`, then we throw an error:

```js
if (throwError && !keys.every(key => Object.keys(object).includes(key))) {
  throw new Error(`Unrecognised key passed to filter-object-by-keys`);
}
```

Otherwise we move on.

We now `map` over our `keys` array, and add each key to the `returnObj`, giving it the same value as the equivalent key within our `object`.

```js
keys.map(key => {
  returnObj[key] = object[key];
});
```

Lastly we return our `returnObj`:

```js
return returnObj;
```

## Setup {#setup}

This code can either be copied into your project, or installed and used as a package by running:

```
npm install filter-object-by-keys
```

You then import it into your project with

```js
import filterObject from 'filter-object-by-keys';
```

## Examples {#examples}

```js
import filterObject from 'filter-object-by-keys';

const myObject = { name: 'John Smith', age: 45, job: 'Accountant' };

console.log(filterObject(myObject, ['name', 'job'])); // { name: 'John Smith', job: 'Accountant' }
console.log(filterObject(myObject, ['age', 'name'])); // { age: 45, name: 'John Smith' }

console.log(filterObject(myObject, ['name', 'hometown'])); // Error: Unrecognised key passed to filter-object-by-keys
console.log(filterObject(myObject, ['name', 'hometown'], false)); // { name: 'John Smith', hometown: undefined }
```
