---
title: 'Meals of Change'
description: 'This is the Meals of Change description' # TODO - Update this
coverImage: '/images/meals-of-change/screenshot.png'
published: '2020-03-16'
lastUpdated: '2020-03-16'
tags: 'Ruby on Rails, Next JS, React, Redux Toolkit, Tailwind CSS, Heroku, Vercel, S3, PostgreSQL'
---

## Background

At the time I started this project, I'd been coding for around three years. I'd worked almost solely as a Rails dev during that time, only ever using React very reluctantly.

During those jobs, I'd never been given any time to learn React, and in the first, it was React, pre-hooks, with Redux, pre-Redux Toolkit. With zero React learning behind me, I couldn't make head nor tail of what most of the code meant. I got by, by looking at and trying to replicate the existing code, but not really understanding what was going on.

I had a similar experience in my next job where, despite being hired as a backend Rails dev, I was again put onto React projects despite my insistance that we had devs in the team better-suited to the task, and again, I was able to scrape by, just by trying to replicate, even while not understanding the existing code.

These experiences gave me a real aversion to React, as I was just thrown into these occasional React projects, often with tight deadlines, with zero time to actually learn even the basics.

All of that being said, when I came to the end of my time in the latter of these jobs, I was acutely aware that while very talented as a Rails dev, the gaping hole in my skillset was the lack of a front-end library.

On my personal projects up to this time, I'd got by with jQuery, and even vanilla JavaScript. But if I really wanted to consider myself a fullstack dev, and to be able to build modern projects from start to deployment, I needed the knowledge of a front-end library. So on leaving this job, and even slightly before, I focussed all of my energy onto learning React.

And you know what? When you actually have the time learn it properly, and aren't just thrown into projects with zero knowledge and given tight deadlines, React is really a joy to work with.

I try to be as receptive as I can to all sources of knowledge, although there's no doubting that my primary resource for learning React was Academind's excellent course, [React - The Complete Guide](https://www.udemy.com/course/react-the-complete-guide-incl-redux/).

I spent about a month working through this course as if it was my full-time job. But as with any skill, it's only useful and only sharpened so much as you put it into practice. I wanted a project that would utilise everything that I'd learned, and put it into practice.

That's where Meals of Change comes in.

I've always been a fan of recipes apps as a means of learning, because they ask for such a wide range of skills; forms, photo uploads, complex styling etc. And this project could almost be considered version 3.

When I'd finished the Rails bootcamp that largely introduced me to coding, the first project I made, starting the day after graduation while still drunk from the night before, was another recipes app called 'Plant as Usual'.

It was an app for plant-based recipes, and the rationale behind the name was how some people think of plant-based meals as very bland. 'Plant as Usual' was an ironic play on the phrase 'bland as usual', where the app would try to show that plant-based recipes were anything but bland.

It was also that the domain only cost £6 per year. Had I been able to afford it, I'd have gone for something much more generic.

That app, Plant as Usual version 1, was the first app that I built and hosted from scratch, and it led to me getting my first coding job. But alas, a year or so later, now with some experience under my belt, I looked back at this app with a bit of shame for how bad the code now looked to me.

That spawned Plant as Usual version 2; a much improved, from the ground up rebuild of Plant as Usual version 1.

But for however improved the Rails code within it was, the front-end was built with jQuery.

At this point, never having the time to grasp the basic workings of React, I found jQuery far easier to work with, despite the way that people spoke about it online as some archaic language.

_"Hey... it works for me"_, I thought to myself.

However, a couple of years after Plant as Usual version 2, I now finally had an understanding of the basics of React, so I too looked at jQuery with a bit of disdain.

_"Oh, I get it now."_

And so was spawned, Plant as Usual version 3, although going through a rebrand, again which was driven by the .com domains that were available for £6/year, Meals of Change was born.

## Tools

Given my skillset at this point, there was only really two options for building this app. Either it would be a Rails monolith that included a React frontend. Or it would be two separate services, with a Rails API as the backend, and a React frontend.

I opted for the latter of these, partly for the technical challenge. This project was more a learning experience than anything else, and I hadn't built a Rails API before. But also, I philosophically like having services broken-up as much as possible. I think it makes them easier to work on and easier to maintain.

At a later date, if I wanted to, I could build a completely new front-end. Or I could build an iOS app, or an Android app, and all would be able to work with this backend right away. Building a monolith you don't have that flexibility, so I knew that going forward, this would be the kind of path I'd want to take.

### Frontend

This was to be my first time working with React, where I actually had any knowledge of React. And based on the tools I'd found to be most intuitive whilst learning, I opted to use **Next.js** rather than pure React. I'd been turned onto Next.js by this point because of it's intuitive routing, and for its search engine friendliness.

I knew the app had the potential to grow, so wanted some app-wide state management, and of the tools I'd used so far, found **Redux Toolkit** to be the best to work with.

For styling, I started off with CSS modules, but at some point in the early stages of development, became aware of and ultimately intrigued by **Tailwind CSS**.

After spending a day learning about it and playing around with it, I jumped right onto the Tailwind bandwagon, and spent another day converting what styling existed in Meals of Change at that point, to Tailwind CSS.

### API

Having worked with Rails for three years at this point, my Rails stack was far more established:

PostgreSQL database, RSpec for testing, Pundit for authorization (I'll go into authentication later).

## Build process

For the first time building an app made of two serparate services, there were two issues that I anticipated being stumbling blocks, so I'll go over those first.

### Authentication

Authentication while working on a Rails monolith is easy. Generally it involves the Devise gem, but regardless, having the user login in the same place that you verify them makes things simple. Having these two parts in serparate services adds some complexity.

Fighting my instinct was to again use Devise, I ultimately decided to use Rails' built-in _'has_secure_password'_.

Although I used multiple sources to help me understand how to do this, I have to give props to edutechional (try saying that quickly) for posting [this tutorial playlist](https://youtube.com/playlist?list=PLgYiyoyNPrv_yNp5Pzsx0A3gQ8-tfg66j) on YouTube, as it helped immensely.

#### API

Starting with the Rails API, the first step is adding `rack-cors` to the Gemfile and running `bundle`.

```
# Gemfile

...
gem 'rack-cors', :require => 'rack/cors'
...
```

From their own [documentation](https://github.com/cyu/rack-cors), Rack::Cors _"provides support for Cross-Origin Resource Sharing (CORS) for Rack compatible web applications,"_ which is just a fancy way of saying that it allows you to white-list external domains. So if, as is the case here, I have the API hosted in one place, and it's receiving requests from a front-end hosted in another place, Rack::Cors allows you to white-list the domain of the front-end.

And to that end, it was necessary to white-list two URLs:

_'http://localhost:3000'_ (where I'd be running the Next.js front-end during development) and _'https://mealsofchange.com'_ (the production front-end URL).

Therefore, I added a _'cors.rb'_ initializer file with the following:

```rb
# config/initializers/cors.rb

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:3000"
    resource "*", headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head], credentials: true
  end

  allow do
    origins "https://mealsofchange.com"
    resource "*", headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head], credentials: true
  end
end
```

The methods `[:get, :post, :put, :patch, :delete, :options, :head]` are all the methods which I could call from the front-end (so basically white-listing every possible method for the given URL). `credentials: true` is what allows you to pass your cookie (created below) between the front-end and the back-end.

Next we need to define our cookie, and we do that in _'session_store.rb'_.

```rb
# config/initializers/session_store.rb

if Rails.env == 'production'
  Rails.application.config.session_store :cookie_store, key: "_meals_of_change", domain: "api.mealsofchange.com"
else
  Rails.application.config.session_store :cookie_store, key: "_meals_of_change"
end
```

`Rails.application.config.session_store` says that for our sessions, we are going to use cookies (`:cookie_store`). The `key:` is the name of the cookie. This could be anything, but would typically be the name of your app, starting with an underscore: `"_meals_of_change"`. The `domain:` is the domain where this API is hosted.

I created a subdomain `api`, which once up on Heroku, I pointed to this api, so my domain (for production) is `"api.mealsofchange.com"` (and if you visit [http://api.mealsofchange.com/](http://api.mealsofchange.com/) you should see the returned json `{"status":"It's working"}`).

![Meals of Change API](/images/meals-of-change/api-home.png)

To see the cookie `Rails.application.config.session_store :cookie_store, key: "_meals_of_change", domain: "api.mealsofchange.com"`, go to [mealsofchange.com](https://mealsofchange.com/) and sign-up/login.

Then open up the inspector (on Chrome it's `right click -> Inspect`, or press `option + command + I` on a mac), navigate to `Application`, then in the left pane go to `Storage -> Cookies -> https://mealsofchange.com`.

You should see a cookie with the 'Name' `_meals_of_change` (as we set the `key:` above), with the 'Domain' `.api.mealsofchange.com` (as we set with `domain:` above).

![Meals of Change cookie](/images/meals-of-change/cookie.png)

With the config now set, it's necessary to add another gem `bcrypt`, so again update your Gemfile as below and run `bundle`.

```
# Gemfile

...
gem 'bcrypt', '~> 3.1.7'
gem 'rack-cors', :require => 'rack/cors'
...
```

This gem allows us to use the `has_secure_password` method (see the ['has_secure_password' docs](https://api.rubyonrails.org/classes/ActiveModel/SecurePassword/ClassMethods.html#method-i-has_secure_password)), which _"requires you to have a `XXX_digest` attribute. Where `XXX` is the attribute name of your desired password."_

In other words, assuming that you want your authentication to be on the `User` model, you need to have, for example, a `password_digest` field on `User`.

So to that end, I created a `Users` table in the database, with `email` and `password_digest` fields, with the following migration.

```rb
class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :email
      t.string :password_digest

      t.timestamps
    end
  end
end
```

Then in the `User` model, I added the `has_secure_password` method, which requires that the `password_digest` field is encrypted.

```rb
# app/models/user.rb

class User < ApplicationRecord
  has_secure_password
  ...
end
```

So if at this point, I was to create a user in the console, the `password_digest` field would be something like `$2a$12$u3bnTiRcPsOoNhqA97DE5.4kA0yeHGauHGwNR/dfBkGm0im8s5wva`.

With this all (hopefully) working, what's left is to add the registrations controller (to allow a new user to register/sign-up), and the sessions controller (to allow a registered user to login/logout).

So firstly we need to add the routes for these two controllers:

```rb
# config/routes.rb

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :registrations, only: [:create]
      resources :sessions, only: [:create]
      get :logged_in, to: 'sessions#logged_in'
      delete :logout, to: 'sessions#logout'
      ...
    end
  end
end
```

The first of these actions is to allow a user to register.

From the front-end we want to recieve an `email`, a `password`, and a `password_confirmation` field.

Thanks to `has_secure_password`, a validation exists that a password must be present when a user is created. I have separately validated that a user must have a unique email:

```rb
# app/models/user.rb

class User < ApplicationRecord
  has_secure_password
  ...
  validates_presence_of :email, :display_name
  validates_uniqueness_of :email, :display_name, case_sensitive: false
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  ...
end
```

However, as there is no `password_confirmation` field on the `User` model, we cannot add a presence validation for it. So to ensure that a password confirmation is recived from the front-end, the first thing to do in the `registration#create` action, is to raise an exception if the `password_confirmation` field is not included:

```rb
raise 'Password confirmation not included' unless params['user']['password_confirmation']
```

We then want to create the user, and will do so with strong params:

```rb
def create
  raise 'Password confirmation not included' unless params['user']['password_confirmation']

  user = User.create!(user_params)
end

private

def user_params
  params.require(:user).permit(:email, :password, :password_confirmation)
end
```

And should the user be created successfully, we first want to create a cookie and set the user to the session:

```rb
session[:user_id] = user.id
```

We'll then tell the front-end that this was done successfully, by returning a status of `:created`, and rendering a json with `logged_in: true` and returning the user.

```rb
render json: {
  logged_in: true,
  user: user
}, status: :created
```

However, we also want to let the user know if this was unsuccessful, so we can wrap the whole thing in a `begin/rescue` block, and add a couple of rescue conditions.

If validations failed, which throw the `ActiveRecord::RecordInvalid` exception, we want to return just one message in a human-readable format (I find it better to give the user one error at a time, rather than telling them that their email is invalid, and it's already taken, and the password isn't long enough all at once). We can do that with:

```rb
rescue ActiveRecord::RecordInvalid => e
  render json: {
    error_message: e.message.split(':')&.last&.strip || 'Something went wrong'
  }, status: :unprocessable_entity
```

For all other exceptions, including our `raise 'Password confirmation not included' unless params['user']['password_confirmation']` from earlier, we can just return the message:

```rb
rescue => e
  render json: {
    error_message: e.message
  }, status: :unprocessable_entity
```

When all put together, the registrations controller will be:

```rb
# app/controllers/api/v1/registrations_controller.rb

module Api
  module V1
    class RegistrationsController < Api::V1::BaseController
      def create
        begin
          raise 'Password confirmation not included' unless params['user']['password_confirmation']

          user = User.create!(user_params)

          session[:user_id] = user.id
          render json: {
            logged_in: true,
            user: user
          }, status: :created
        rescue ActiveRecord::RecordInvalid => e
          render json: {
            error_message: e.message.split(':')&.last&.strip || 'Something went wrong'
          }, status: :unprocessable_entity
        rescue => e
          render json: {
            error_message: e.message
          }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.require(:user).permit(:email, :password, :password_confirmation, :display_name)
      end
    end
  end
end

```

Now that users can register, we need to allow them to create a session, or to login, and we do this with the `sessions#create` action.

So in the sessions controller, we add:

```rb
# app/controllers/api/v1/sessions_controller.rb

module Api
  module V1
    class SessionsController < Api::V1::BaseController
      def create
        user = User.find_by(email: params['user']['email'])
                   .try(:authenticate, params['user']['password'])
      end
    end
  end
end
```

The `authenticate` method is given to us by `has_secure_password`. Once you've found the user using the given email, it will check if the given password matches this user's password. If they match, it will return the user. If they don't, it will return `false`.

If the user is returned, what we then want to do is create a cookie, which we do by setting the user to the session:

```rb
session[:user_id] = user.id
```

Then we want to communicate that the user is logged-in, so we return a json of `status: :created` (as in, the session was created), and `logged_in: true`.

We can also return the user.

However, as we don't want to do this if the `authenticate` method returned false, we can wrap the whole thing in a `begin/rescue` block, `raise` an exception if the user is not returned, and instead render an error message with `status: :unauthorized`.

The full `create` action would now be:

```rb
# app/controllers/api/v1/sessions_controller.rb

module Api
  module V1
    class SessionsController < Api::V1::BaseController
      def create
        begin
          user = User.find_by(email: params['user']['email'])
                     .try(:authenticate, params['user']['password'])

          raise 'Incorrect username/password' unless user

          session[:user_id] = user.id
          render json: {
            logged_in: true,
            user: user
          }, status: :created
        rescue => e
          render json: { error_message: e.message }, status: :unauthorized
        end
      end
    end
  end
end
```

### Photo uploading

The other issue which exceeded my knowledge at the start of this project, was allowing users to upload photos of their recipes.

In Rails monolith apps that I'd worked on, this was no issue. You upload the photo from Rails to a third-party service, and fetch it again when you need it.

Now though, with separate services, do you want to go from the front-end, to the API, to the third-party service and back again, every time you want to upload of fetch a photo?

No, that's madness. Sending large files to the backend to just act as an intermediary to send them on again is a huge waste of resources. You want the front-end and the storage service to communicate with each other. But when you store that data for the photos in the backend, how exactly do you do that?

That's what I didn't know either. And again, I used multiple sources to eventually solve this quandry, the most useful of which was this article by [Elliott King](https://elliott-king.github.io/2020/09/s3-heroku-rails/).

Again, going into the finer details of this is a little out of the scope of this article, but coming soon will be a blog post with the exact code that I used.

<!-- ## Build process

### API

I wanted to keep everything as simple as possible.

I say that every project, before ending up with a database structure looking like Spaghetti Junction.

On this project I was determined to keep my word, and really balance-out the benefit of a feature compared to the complexity it would add, so I ended up with a database of just seven tables (discounting those for ActiveStorage):

![Meals of Change database](/images/meals-of-change-database-structure.png)

A user has many recipes, as well as many recipe bookmarks. A recipe also has many recipe bookmarks, as well as many ingredients, steps and recipe tags. A tag has many recipe tags.

That's it.

And in keeping with this theme of simplicity, I wanted to keep the models and controllers as lean as possible. -->

<!-- ![Meals of Change screenshot](/images/meals-of-change.png) -->
