---
title: 'Meals of Change'
description: 'This is the Meals of Change description' # TODO - Update this
coverImage: '/images/meals-of-change.png'
published: '2020-03-16'
lastUpdated: '2020-03-16'
tags: 'Ruby on Rails, Next JS, React, Redux Toolkit, Tailwind CSS, Heroku, Vercel, S3, PostgreSQL'
---

## Background

At the time I started this project, I'd been coding for around three years. I'd worked almost solely as a Rails dev during that time, only ever using React very reluctantly.

During those jobs, I'd never been given any time to learn React, and in the first, it was React, pre-hooks, with Redux, pre Redux Toolkit. With zero React learning behind me, I couldn't make head nor tail of what most of the code meant. I got by, by looking at and trying to replicate the existing code, but not really understanding what was going on.

I had a similar experience in my next job where, despite being hired as a backend Rails dev, I was again put onto React projects despite my insistance that we had devs in the team better-suited to the task, and again I was able to scrape by, just by trying to replicate, even while not understanding the existing code.

These experiences gave me a real aversion to React, as I was just thrown into these occasional React projects, often with tight deadlines, with zero time to actually learn the basics.

All of that being said, when I came to the end of my time in the latter of these jobs, I was acutely aware that while very talented as a Rails dev, the gaping hole in my skillset was the lack of a front-end library.

On my personal projects up to this time, I'd got by with jQuery, and even vanilla Javascript. But if I really wanted to consider myself a fullstack dev, and to be able to build modern projects from start to deployment, I needed the knowledge of a front-end library. So on leaving this job, and even slightly before, I focussed all of my energy on learning React.

And you know what? When you're actually given the time learn it properly, and not just thrown into projects with zero knowledge and given tight deadlines, React is really a joy to work with.

I try to be as receptive as I can to all sources of knowledge, although there's no doubting that my primary resource for learning React was Academind's excellent course, [React - The Complete Guide](https://www.udemy.com/course/react-the-complete-guide-incl-redux/).

I spent about a month working through this course as if my full-time job. But as with any skill, it's only useful and only sharpened so much as you put it into practice. I wanted a project that could would utilise everything that I'd learned, and put it into practice.

That's where Meals of Change comes in.

I've always been a fan of recipes apps as a means of learning, because they ask for such a wide range of skills; forms, photo uploads, complex styling etc. And this project could almost be considered version 3.

When I'd finished the Rails bootcamp that largely introduced me to coding, the first project I made, starting the day after graduation while still drunk from the night before, was another recipes app called 'Plant as Usual'.

It was an app for plant-based recipes, and the rationale for the name was how people think of plant-based meals as very bland. 'Plant as Usual' was an ironic play on the phrase 'bland as usual', where it would try to show that plant-based recipes didn't have to be bland.

It was also that the domain only cost £6 per year. Had I been able to afford it, I'd have gone for something much more generic.

That app, Plant as Usual version 1, was the first app that I built and hosted from scratch, and it led to me getting my first coding job. But alas, a year or so later, now with some experience under my belt, I looked back at this app with a bit of shame for how bad the code now looked to me.

That spawned Plant as Usual version 2; a much improved, from the ground up rebuild of Plant as Usual version 1.

But for however improved the Rails code within it was, the front-end was built with jQuery.

As at this point, never having the time to grasp the basic workings of React, I found jQuery far easier to work with, despite the way that people spoke about it online as some archaic language.

_"Hey... it works for me"_, I thought to myself.

But now I finally had an understanding of the basics of React, I too looked at jQuery with a bit of disdain.

_"Oh, I get it now."_

And so was spawned, Plant as Usual version 3, although going through a rebrand, again which was driven by the .com domains that were available for £6/year, Meals of Change was born.

## Tools

Given my skillset at this point, there was only really two options for building this app. Either it would be a Rails monolith that included a React frontend. Or it would be two separate services, with a Rails API as the backend, and a React frontend.

I opted for the latter of these, partly for the technical challenge. This project was more of a learning experience than anything else, and I hadn't built a Rails API before. But also, I philosophically like having services broken-up as much as possible. I think it makes them easier to work on and easier to maintain.

At a later date, if I wanted to, I could build a completely new front-end. Or I could build an iOS app, or an Android app, and all would be able to work with this backend right away. Building a monolith you don't have that flexibility, so I knew that going forward, this would be the kind of path I'd want to take.

### Frontend

This was to be my first time working with React, where I actually had any knowledge of React. And based on the tools I'd found to be most intuitive whilst learning React, I opted to use **Next.js** rather than pure React. I'd been turned onto Next.js by this point because of it's intuitive routing, and for its search engine friendliness.

I knew the app had the potential to grow, so wanted some app-wide state management, and of the tools I'd used so far, found **Redux Toolkit** to be the best to work with.

For styling, I started off with CSS modules, but at some point in the early stages of development, became aware of and ultimately intrigued by **Tailwind CSS**.

After spending a day learning about it and playing around with it, I jumped right onto the Tailwind hype-train, and spent another day converting what styling existed in Meals of Change at that point, to Tailwind CSS.

### API

Having worked with Rails for three years at this point, my Rails stack was far more established:

PostgreSQL database, RSpec for testing, Pundit for authorization (I'll go into authentication later).

## Issues

Building for the first time, an app made-up of two serparate services, there were two issues that I anticipated being stumbling blocks:

### Authentication

Authentication while working on a Rails monolith is easy. Generally it involves the Devise gem, but regardless, having the user login in the same place that you verify them makes things simple. Having these two parts in serparate services adds some complexity.

Fighting my instinct was to again use Devise, I ultimately decided to use Rails' built-in _'has_secure_password'_.

Although I used multiple sources to help me understand how to do this, I have to give props to edutechional (try saying that quickly) for posting [this tutorial playlist](https://youtube.com/playlist?list=PLgYiyoyNPrv_yNp5Pzsx0A3gQ8-tfg66j) on YouTube, as it helped immensely.

Coming soon will be a blog that goes over this in detail.

### Photo uploading

The other issue which exceeded my knowledge at the start of this project, was allowing users to upload photos of their recipes.

In Rails monolith apps that I'd worked on, this was no issue. You upload the photo from Rails to a third-party service, and fetch it again when you need it.

Now though, with separate services, do you want to go from the front-end, to the API, to the third-party service and back again, every time you want to upload of fetch a photo?

No, that's madness. Sending large files to the backend to just act as an intermediary to send them on again is a huge waste of resources. You want the front-end and the storage service to communicate with each other. But when you store that data for the photos in the backend, how exactly do you do that?

That's what I didn't know either. And again, I used multiple sources to eventually solve this quandry, the most useful of which was this article by [Elliott King](https://elliott-king.github.io/2020/09/s3-heroku-rails/).

Again, going into the finer details of this is a little out of the scope of this article, but coming soon will be a blog post with the exact code that I used.

<!-- ![Meals of Change screenshot](/images/meals-of-change.png) -->
