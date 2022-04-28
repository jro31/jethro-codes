---
title: 'Next.js'
description: 'A starting template of a Next.js project, setup with Redux Toolkit and Tailwind CSS 3.'
published: '2022-04-28'
tags: 'Next JS. React, Redux Toolkit, Tailwind CSS'
---

## Repo

This template is a public repo on GitHub, and can be found [here](https://github.com/jro31/next-js-template).

## Specifications

This project is setup with **Next.js 12.1.4** and **React 17.0.2**.

It also includes **Redux Toolkit 1.8.1**, setup with a Redux Store and a test reducer.

**Tailwind CSS 3.0.23** is installed and setup to work with [Tailwind UI](https://tailwindui.com/) components, meaning that:

- `Inter` is setup as the default font.
- The [`@headlessui/react`](https://www.npmjs.com/package/@headlessui/react) package is installed (see [here](https://headlessui.dev/) for details).
- The [`@heroicons/react`](https://www.npmjs.com/package/@heroicons/react) package is installed (see [here](https://heroicons.com/) for details).
- The Tailwind [forms plugin](https://github.com/tailwindlabs/tailwindcss-forms) is installed.

In addition to the 5 [standard Tailwind breakpoints](https://tailwindcss.com/docs/responsive-design), I have also added an `xs` breakpoint at 512px, and a `2xs` breakpoint at 384px.

These can be used with classes just like the standard breakpoints, for example `<div className='text-base 2xs:text-lg xs:text-xl sm:text-2xl'>`.

Note that I have **not** installed the Tailwind [typography plugin](https://tailwindcss.com/docs/typography-plugin) or the Tailwind [aspect-ratio plugin](https://github.com/tailwindlabs/tailwindcss-aspect-ratio). These are required for _some_ Tailwind UI components, so should be installed as needed.

## Setup

Feel free to clone this template or use it any way you see fit. However, the simplest way to get started is to:

- Navigate to the template on [GitHub](https://github.com/jro31/next-js-template).

- Click 'Use this template'.
  ![Use this template button](/images/templates/next-js/use-this-template.png)

<!-- - On the next screen, fill-in a repository name and click 'Create repository from template'.
  ![Create a new repository](/images/templates/rails-api/create-new-repo.png)

- On the next page, click the 'Code' button, and in the dropdown, copy the url beneath 'HTTPS'.
  ![Copy the URL](/images/templates/rails-api/clone-url.png)

- In your local terminal, CD into the folder where you want to store the project. Then type `git clone [THE URL YOU JUST COPIED]`, for example `git clone https://github.com/jro31/my-new-project.git`, and press `Enter`.
  ![Clone the repo](/images/templates/rails-api/git-clone.png)

- CD into the created repo, for example `cd my-new-project`.
  ![CD into the repo](/images/templates/rails-api/cd-into-repo.png)

- To check that all specs are passing, run `bundle exec rspec`. You should get 0 failures.
  ![Run specs](/images/templates/rails-api/bundle-exec-rspec.png)

  ![No failures](/images/templates/rails-api/no-failures.png)

- Run `rails s` to start the server. Then navigate to [localhost:3001](http://localhost:3001/). If all is well, you should see `{"status":"It's working"}`.
  ![Run rails s](/images/templates/rails-api/rails-s.png)

  ![It's working!](/images/templates/rails-api/its-working.png) -->

## To do after setup
