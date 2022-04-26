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
