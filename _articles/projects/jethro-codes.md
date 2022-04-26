---
title: 'jethro.codes'
description: 'A look behind the mechanics of how this app utilises Markdown files to automatically update the homepage and other pages.'
coverImage: '/images/projects/jethro-codes/hero-screenshot.png'
published: '2022-04-25' # TODO - Update this
tags: 'Next JS, React, Tailwind CSS, Vercel'
---

I wasn’t going to write an article about this app, because I thought it’d be a bit weird to write about an app within the app. Some kind of appception.

I imagine that’s what the people who make Git go through everyday.

However, in creating this app, I learned a lot that I didn't know before, so I think it’s worth going over.

Being an app consisting mostly of articles, it made sense to me that I’d write them in Markdown.

And what I wanted, was to be able to add a Markdown file, and by simply adding this file and doing nothing else, I wanted the homepage to update, the section page (for example, the 'Projects' page or the 'Templates' page) to update, and even the sitemap to update.

I had a rough idea how I could achieve this, but then I found that [Vercel](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) has a template project that was better than my idea, and using that as my starting point, I was able to build the foundations of this app so it does exactly what I was hoping.

I added this article as a Markdown file, and by doing nothing else, as if by magic it appears on the homepage, the projects page, and in the sitemap.

## Background

My reasoning for creating this app was fairly simple.

At this point, [jethrowilliams.com](https://jethrowilliams.com/) was already online, and that was my sort of… front page, if you will.

If I want to give someone a very quick overview of exactly what it is I do, and how they can contact me, then I can direct them to jethrowilliams.com. And for the majority of people, that’s going to be enough.

However, this front-page doesn’t allow me to go into any depth on the code I create because most people, especially non-technical people, just won’t care.

So I wanted a place, partly for my own benefit because I find it insightful to have to explain something in a manner that others can understand, where I can go into more depth on the code that I write.

As coincidence would have it, I already owned the domain jethro.codes because, on putting my name into the Namecheap app in a moment of boredom once, I stumbled across it, it was available, and it had a 90% discount.

So I figured, for £3 I’ll buy it for a year. If I think of something to do with it, great. If not, it's cost me less than a cup of coffee.

And I don’t drink coffee, so I had nothing to spend that money on anyway.

## Styling

Before I get onto the technical part of this app, a quick word about styling.

This app may look like it was cobbled together with a bunch of random components that don’t have any relation to each other. And that’s because... well that’s exactly what it is.

Up to this point, every app I'd ever made I'd done the styling myself. And although I enjoy and I'm very good at styling, it's such a time consuming process, tweaking every element for various devices and screen sizes.

I just want a place where I can write about code, and in all truth, so long as it doesn't look completely atrocious, I'm not too concerned with how it looks.

So while I have done some minor customisation, this app is largely made up of [Tailwind UI](https://tailwindui.com/) components.

Again, with some minor customisation, the Markdown articles themselves are styled with the [Tailwind typography plugin](https://tailwindcss.com/docs/typography-plugin).

The Tailwind docs are some of the best I've ever come across, and do a far better job of explaining how to use these features than I ever could, so I won't say anything more about the styling for jethro.codes in this article, because I spent very little time on it.

What I instead want to focus on is fetching the Markdown articles, and updating the app accordingly.

## Structure

Before getting into the API and fetching the articles, it's worth mentioning the stucture of the app to make everything a little clearer.

Note that this is (fairly obviously) a simplified version of the app. I'm only showing relevant folders here.

```
📦_articles
 ┣ 📂projects
 ┃ ┣ 📜jethro-codes.md
 ┃ ┗ 📜meals-of-change.md
 ┣ 📂templates
 ┃ ┗ 📜rails-api.md
 ┗ 📜my-story.md
📦lib
 ┣ 📜api.js
 ┗ 📜markdownToHtml.js
📦pages
 ┣ 📂[section]
 ┃ ┗ 📜[slug].js
 ┣ 📂contact
 ┃ ┗ 📜index.js
 ┣ 📂my-story
 ┃ ┗ 📜index.js
 ┣ 📜[section].js
 ┣ 📜_app.js
 ┣ 📜index.js
 ┗ 📜sitemap.xml.js
```

To start with, the `_articles` folder, is where the articles are added as Markdown files.

The `pages` folder shows the pages within the app.

The `api.js` file in the `lib` folder is where all the magic happens. This is where the logic to look within the `_articles` folder and return the correct data to the pages lives.

If you're used to working on MVC apps, then the `api.js` file is very much the controller; the intermediary between the data (the `_articles`) and what the user sees (the `pages`).

If you understand how the API works, then the rest of the app is fairly rudimentary, so let's start by going over that.

## API

The API is based on [the API from the Vercel demo project](https://github.com/vercel/next.js/blob/canary/examples/blog-starter/lib/api.js).

It exports three functions needed by the various pages used within the app:

- `getArticles`
- `getArticleBySlug`
- `allContainingFolders`

### `allContainingFolders`

I'll start with the simplest of these: `allContainingFolders`.

This function returns any folde within `_article`, that contains a markdown article.

```js
import fs from 'fs';
import { join } from 'path';

const articlesPath = join(process.cwd(), '_articles');

export const allContainingFolders = () =>
  ['', ...fs.readdirSync(articlesPath)].filter(file => file.slice(-3) !== '.md');
```

`process.cwd()` returns the current working directory. The `join()` function, joins the arguments you give it, as a path. So by running `join(process.cwd(), '_articles')`, we pass it the current working directory, followed by `_articles`, to give us the path to our `_articles` folder.

This is set to the `articlesPath` variable.

`fs` (short for 'file system') is a Node library. The `readdirSync()` function (short for 'read directory synchronously') returns the contents of the directory that you pass it.

So `fs.readdirSync(articlesPath)` returns an array of all files and folders which are direct children to the `_articles` folder.

Looking back to the file tree above, that is `['my-story.md', 'projects', 'templates']`.

We are looking _just_ for folders here, not files, so `.filter(file => file.slice(-3) !== '.md')` removes any returns where the last three characters of the string are `.md` (so in this example, it will remove `'my-story.md'`).

However, because there _is_ a Markdown article within the `_articles` folder itself, we also want to return this, hence adding `''` to the returned array (the `my-story.md` article is a permanent fixture of this app, so no need to programatically check if a Markdown file exists as a child to the `_articles` directory).

Therefore, given the file tree above, `allContainingFolders()` will return `[ '', 'projects', 'templates' ]`.

### `getArticleBySlug`

The next exportable function in the API is `getArticleBySlug`. This returns one article, based on the slug passed-into it.

A 'slug' in this context is the part of the URL that comes after the last backslash. So on this page, the slug is `jethro-codes`. On the `https://jethro.codes/my-story` page, the slug is `my-story`.

As a side-note, I was curious why it's called a slug, because when I think of a slug, I think of a snail without a shell, which seems completely irrelevant here.

The best explanation I could find was [this StackOverflow answer](https://stackoverflow.com/a/4230937/2475306), which gives a couple of possibilities for the origin of 'slug' in this context.

It's either _"an informal name given to a story during the production process"_ of the printing press, or _"screenplays had "slug lines" at the start of each scene, which basically sets the background for that scene."_

Regardless of where it came from, this function returns one article, based on the slug you pass it:

```js
import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const articlesPath = join(process.cwd(), '_articles');
const directoryPath = containingFolder =>
  `${articlesPath}${containingFolder ? `/${containingFolder}` : ''}`;

export const getArticleBySlug = (slug, fields = [], containingFolder = '') => {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(directoryPath(containingFolder), `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items = {};

  fields.forEach(field => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'section') {
      items[field] = containingFolder;
    }
    if (field === 'content') {
      items[field] = content;
    }
    if (field === 'minsToRead') {
      items[field] = Math.ceil(content.split(' ').length / 200);
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });

  return items;
};
```

This function accepts three arguments:

The `slug` of the article, the `fields` within the article that you want returned (we'll get into that in a moment), and the `containingFolder`.

To start with, `const realSlug = slug.replace(/\.md$/, '');` simply removes the `.md` extension, if one is passed-in on the slug, and sets the resulting string to `realSlug`.

For example, if I passed `my-story.md` in as the `slug` argument, this would set `my-story` to `realSlug`.

On the next line, we use the `join()` function again (covered in the previous section).

The `directoryPath()` function simply checks whether the a `containingFolder` is present. If it is, it will return a string of the `articlesPath` followed by the containing folder, if not it will just return the`articlesPath`.

So `` const fullPath = join(directoryPath(containingFolder), `${realSlug}.md`);  `` sets the full path of the location of the article, to the `fullPath` variable.

Now that we have this path, we pass it to `fs.readFileSync`, which returns the contents of the file path we pass to it.

So, for example, if our `fullPath` variable is set to `jethro-codes/_articles/projects/meals-of-change.md`, then `const fileContents = fs.readFileSync(fullPath, 'utf8');` sets the contents of the `meals-of-change.md` file to the `fileContents` variable, in utf8 format.

Lastly we pass this `fileContents` to [`gray-matter`](https://github.com/jonschlinkert/gray-matter).

What `gray-matter` does, is allow us to add YAML to the top of our Markdown files.

For example, at the top of this file that I'm typing right now, is the following:

```yaml
---
title: 'jethro.codes'
description: 'A look behind the mechanics of how this app utilises Markdown files to automatically update the homepage and other pages.'
coverImage: '/images/projects/jethro-codes/hero-screenshot.png'
published: '2022-04-25' # TODO - Update this
tags: 'Next JS, React, Tailwind CSS, Vercel'
---
```

When we call `matter(fileContents)`, it returns an object with two keys: `data` and `content`.

The value of `content` is the Markdown that comes _after_ this yaml code, so in this article:

> I wasn’t going to write an article about this app, because I thought it’d be a bit weird to write about an app within the app. Some kind of appception...

(and this is exactly what I meant)

It contains formatting, although for simplicity I won't add that here.

The value of `data`, is another object, that contains "data" of this YAML code, for example:

```js
data: {
  title: 'jethro.codes',
  description: 'A look behind the mechanics of how this app utilises Markdown files to automatically update the homepage and other pages.',
  coverImage: '/images/projects/jethro-codes/hero-screenshot.png',
  published: '2022-04-25',
  tags: 'Next JS, React, Tailwind CSS, Vercel'
}
```

We then use object destructuring to set the data and content to `data` and `content` variables respectively:

```js
const { data, content } = matter(fileContents);
```

Now we have all that we need to know about the article.

What we eventually return is the `items` object, so now it's just a case of filtering only the data that we want to return, and appending this data to `items`.

This is where the `fields` argument of `getArticleBySlug` comes in. To save accidentally returning too much data, we must pass-in every field we want returned.

We then loop-over each of these fields, and assign them to `items` accordingly:

```js
fields.forEach(field => {
  if (field === 'slug') {
    items[field] = realSlug;
  }
  if (field === 'section') {
    items[field] = containingFolder;
  }
  if (field === 'content') {
    items[field] = content;
  }
  if (field === 'minsToRead') {
    items[field] = Math.ceil(content.split(' ').length / 200);
  }

  if (typeof data[field] !== 'undefined') {
    items[field] = data[field];
  }
});
```

In the client-side code, the `containingFolder` is called the `section`, for example the `projects` section or the `templates` section.

The `minsToRead` field, splits the `content` based on spaces to (roughly) give the number of words in the article (`content.split(' ').length`).

This number is then divided by 200, on the assumption that a person reads around 200 words per minute.

That's the more conservative end of the spectrum of reading speed (per multiple sources), but people tend to read more slowly looking at screens, and I doubt many people will be bothering to print-off these articles to read them, so it makes sense to be at that end.

`if (typeof data[field] !== 'undefined')` simply checks that a field exists in `data` before trying to return it.

And with that, we've set all the data that we need, so return `items`.

## `getArticles`

The last exportable function is `getArticles`.

This uses a lot of the functionality that we've already been over, except that it uses it to return multiple articles.

In the name of simplicity, I'll only add the code that we haven't been over here:

```js
const getArticleSlugs = containingFolder => {
  return fs.readdirSync(directoryPath(containingFolder));
};

const allArticles = (fields = []) => {
  let articlesArray = [];
  allContainingFolders().map(folder => {
    getArticleSlugs(folder).map(slug => {
      if (slug.slice(-3) === '.md') {
        articlesArray.push(getArticleBySlug(slug, fields, folder));
      }
    });
  });
  return articlesArray;
};

const articlesByFolder = (fields = [], folder) =>
  getArticleSlugs(folder).map(slug => getArticleBySlug(slug, fields, folder));

export const getArticles = (fields = [], containingFolder = '') => {
  let articles = containingFolder
    ? articlesByFolder(fields, containingFolder)
    : allArticles(fields);

  return articles.sort((article1, article2) => (article1.published > article2.published ? -1 : 1));
};
```

`getArticles` accepts two arguments; `fields` and `containingFolder`.

`fields` is used as we've seen earlier, to set which fields from each article are returned.

If omitted, the `containingFolder` here determines that we return _all_ articles, as is necessary for the homepage or the sitemap, and calls the `allArticles()` function. If it is provided, then it will return _just_ the articles from within that folder by calling the `articlesByFolder()` function:

```js
containingFolder ? articlesByFolder(fields, containingFolder) : allArticles(fields);
```

Starting with `articlesByFolder()`, it firstly calls `getArticleSlugs()`.

```js
const getArticleSlugs = containingFolder => {
  return fs.readdirSync(directoryPath(containingFolder));
};
```

`getArticleSlugs()` uses the `fs.readdirSync()` function, which we went over earlier, and returns an array of all of the slugs contained _within_ the given folder. For example,

```js
getArticleSlugs('projects');
```

returns

```js
['jethro-codes.md', 'meals-of-change.md'];
```

Now that we know all of the articles that we want to return, it's simply a case of mapping over this array, calling `getArticleBySlug()` on each one, and returning the resulting array.

```js
const articlesByFolder = (fields = [], folder) =>
  getArticleSlugs(folder).map(slug => getArticleBySlug(slug, fields, folder));
```

If instead, a `containingFolder` is not passed to `getArticles()`, we then call the `allArticles()` function.

This function is similar, except we want to return every slug from every folder. So firstly we map over the return from `allContainingFolders()` (which we went over earlier).

```js
allContainingFolders().map(folder => {});
```

Within this map we run _another_ map, calling `getArticleSlugs()` on _each_ folder.

```js
allContainingFolders().map(folder => {
  getArticleSlugs(folder).map(slug => {});
});
```

We only want to call `getArticleBySlug()` on article slugs (and not on folders), so we then run a check that `slug` _is_ in fact an article, by checking that it has an `.md` extension.

```js
allContainingFolders().map(folder => {
  getArticleSlugs(folder).map(slug => {
    if (slug.slice(-3) === '.md') {
    }
  });
});
```

Finally, if `slug` is an article, we call `getArticleBySlug()`, passing-in `slug` and the containing `folder`.

The return is pushed to `articlesArray`, which we return from this function.

```js
const allArticles = (fields = []) => {
  let articlesArray = [];
  allContainingFolders().map(folder => {
    getArticleSlugs(folder).map(slug => {
      if (slug.slice(-3) === '.md') {
        articlesArray.push(getArticleBySlug(slug, fields, folder));
      }
    });
  });
  return articlesArray;
};
```

And with that, whether or not we passed-in a `containingFolder` to `getArticles()`, we now have an array of all the articles that we want to return, set to the variable `articles`.

```js
let articles = containingFolder ? articlesByFolder(fields, containingFolder) : allArticles(fields);
```

The last thing we do is sort the articles by the `published` date.

If you remember the YAML at the top of our Markdown files, we include the date that the article is `published` there. This is what we use to sort them, returning the most recently published first.

```js
articles.sort((article1, article2) => (article1.published > article2.published ? -1 : 1));
```

And with that, our API is done.

We can use this API by calling any of the three exported functions to return either the containing folders, a single article, or an array of articles.

The completed `api.rb` files is therefore:

```js
// lib/api.js

import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const articlesPath = join(process.cwd(), '_articles');
const directoryPath = containingFolder =>
  `${articlesPath}${containingFolder ? `/${containingFolder}` : ''}`;

export const allContainingFolders = () =>
  ['', ...fs.readdirSync(articlesPath)].filter(file => file.slice(-3) !== '.md');

const getArticleSlugs = containingFolder => {
  return fs.readdirSync(directoryPath(containingFolder));
};

export const getArticleBySlug = (slug, fields = [], containingFolder = '') => {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(directoryPath(containingFolder), `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items = {};

  fields.forEach(field => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'section') {
      items[field] = containingFolder;
    }
    if (field === 'content') {
      items[field] = content;
    }
    if (field === 'minsToRead') {
      items[field] = Math.ceil(content.split(' ').length / 200);
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });

  return items;
};

const allArticles = (fields = []) => {
  let articlesArray = [];
  allContainingFolders().map(folder => {
    getArticleSlugs(folder).map(slug => {
      if (slug.slice(-3) === '.md') {
        articlesArray.push(getArticleBySlug(slug, fields, folder));
      }
    });
  });
  return articlesArray;
};

const articlesByFolder = (fields = [], folder) =>
  getArticleSlugs(folder).map(slug => getArticleBySlug(slug, fields, folder));

export const getArticles = (fields = [], containingFolder = '') => {
  let articles = containingFolder
    ? articlesByFolder(fields, containingFolder)
    : allArticles(fields);

  return articles.sort((article1, article2) => (article1.published > article2.published ? -1 : 1));
};
```

## Calling the API

With the API done, we now need to make use of it in a way that the app automatically updates in every way we want it to, simply by adding a Markdown file. And this is where Next.js really comes into its own.
