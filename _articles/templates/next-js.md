---
title: 'Next.js'
description: 'A starting template of a Next.js project, setup with Redux Toolkit and Tailwind CSS 3.'
published: '2022-04-28'
tags: 'Next JS, React, Redux Toolkit, Tailwind CSS'
---

## Repo {#repo}

This template is a public repo on GitHub, and can be found [here](https://github.com/jro31/next-js-template).

## Specifications {#specifications}

This project is setup with **Next.js 12.1.4** and **React 17.0.2**.

It also includes **Redux Toolkit 1.8.1**, setup with a Redux Store and a test reducer.

**Tailwind CSS 3.0.23** is installed and setup to work with [Tailwind UI](https://tailwindui.com/) components, meaning that:

- `Inter` is setup as the default font.
- The [`@headlessui/react`](https://www.npmjs.com/package/@headlessui/react) package is installed (see [here](https://headlessui.dev/) for details).
- The [`@heroicons/react`](https://www.npmjs.com/package/@heroicons/react) package is installed (see [here](https://heroicons.com/) for details).
- The Tailwind [forms plugin](https://github.com/tailwindlabs/tailwindcss-forms) is installed.

In addition to the 5 [standard Tailwind breakpoints](https://tailwindcss.com/docs/responsive-design), I have added an `xs` breakpoint at 512px, and a `2xs` breakpoint at 384px.

These can be used with classes just like the standard breakpoints, for example `<div className='text-base 2xs:text-lg xs:text-xl sm:text-2xl'>`.

Note that I have **not** installed the Tailwind [typography plugin](https://tailwindcss.com/docs/typography-plugin) or the Tailwind [aspect-ratio plugin](https://github.com/tailwindlabs/tailwindcss-aspect-ratio). These are required for _some_ Tailwind UI components, so should be installed as needed.

## Setup {#setup}

Feel free to clone this template or use it any way you see fit. However, the simplest way to get started is to:

- Navigate to the template on [GitHub](https://github.com/jro31/next-js-template).

- Click 'Use this template'.
  ![Use this template button](/images/templates/next-js/use-this-template.png)

- On the next screen, fill-in a repository name and click 'Create repository from template'.
  ![Create a new repository](/images/templates/next-js/create-new-repo.png)

- On the next page, click the 'Code' button, and in the dropdown, copy the url beneath 'HTTPS'.
  ![Copy the URL](/images/templates/next-js/clone-url.png)

- In your local terminal, CD into the folder where you want to store the project. Then type `git clone [THE URL YOU JUST COPIED]`, for example `git clone https://github.com/jro31/my-new-project.git`, and press `Enter`.
  ![Clone the repo](/images/templates/next-js/git-clone.png)

- CD into the created repo, for example `cd my-new-project`.
  ![CD into the repo](/images/templates/next-js/cd-into-repo.png)

- Run `npm install` to install all packages (this requires that you have [Node.js](https://nodejs.org/) installed).
  ![Run npm install](/images/templates/next-js/npm-install.png)

- To start the server, run `npm run dev`.
  ![Run npm install](/images/templates/next-js/npm-run-dev.png)

- Navigate to [localhost:3000](http://localhost:3000/). You should see the following page:
  ![localhost:3000](/images/templates/next-js/localhost-3000.png)

- To check that Redux Toolkit is working, click on the `The test reducer state is true` line. It should toggle between `true` and `false`.

  ![Test reducer true](/images/templates/next-js/test-reducer-true.png)

  ![Test reducer false](/images/templates/next-js/test-reducer-false.png)

- To check that Tailwind CSS is working, resize the viewport (browser window). The `CONTENT GOES HERE` text should change size when:

  - Below 384px
  - 384px to 639px
  - Above 639px

  ![Screen sizes](/images/templates/next-js/screen-sizes.png)

If all of that is working, then you're setup and ready to go!

## To do after setup {#to-do-after-setup}

There are a couple more to-dos to do to get this project setup as your own. They are marked within the code with `TODO` tags.

- You should update the `public/favicon.ico` file to your own favicon. Currently it is the 'Vercel' logo.
- In `package.json` you should update the `"name": "next-js-template",` line to your own project name, for example `"name": "my-new-project",`. The next time you run `npm install`, your `package-lock.json` file will be updated with _your_ project name.
- In order to populate the `<Head>` tag with correct `<title>` and `<meta>` tags, in `pages/index.js` you should:
  - Update the `appTitle` variable to your project name.
  - Update `appDescription` to a description about your app.
  - Update `baseUrl` to the production URL of your app.
  - Add an `images` folder to `public`, and add an image file that you'd like to be seen when people share your app on social media. Then update `socialMediaImagePath` to the path of this image.
  - Update the `<meta name='keywords' content='these, are, some, keywords, about, my project' />` line to be some keywords about your project.
  - Uncomment the `<meta name='twitter:site' content='@my-site-twitter-handle' />` line and add the Twitter handle you want associated to your app.
- If your app will have a navbar, you should put it in `components/layout/index.js`, _above_ the `<main>{props.children}</main>` line.

And with that you're ready to go. Happy hacking!
