---
title: 'Rails API'
description: 'A starting template for a Rails API with login/sign-up functionality, PostgreSQL, RSpec and Pundit.'
published: '2022-04-22'
tags: 'Ruby on Rails, PostgreSQL, RSpec, Pundit'
---

## Repo {#repo}

This template is a public repo on GitHub, and can be found [here](https://github.com/jro31/rails-api-template).

## Specifications {#specifications}

This project template is setup with **Ruby 3.1.0** and **Rails 7.0.1**, the [**Pundit**](https://github.com/varvet/pundit) authorization gem, and has a **PostgreSQL** database.

Testing has been setup with **RSpec**, including [**factory_bot**](https://github.com/thoughtbot/factory_bot/blob/main/GETTING_STARTED.md), [**Faker**](https://github.com/faker-ruby/faker) and [**Database Cleaner Adapter for ActiveRecord**](https://github.com/DatabaseCleaner/database_cleaner-active_record).

It includes authentication setup with Rails' `has_secure_password` (see 'Authentication' and 'Endpoints' sections below).

## Setup {#setup}

Feel free to clone this template or use it any way you see fit. However, the simplest way to get started is to:

- Navigate to the template on [GitHub](https://github.com/jro31/rails-api-template).
- Click 'Use this template'.
  ![Use this template button](/images/templates/rails-api/use-this-template.png)

- On the next screen, fill-in a repository name and click 'Create repository from template'.
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

  ![It's working!](/images/templates/rails-api/its-working.png)

### Notes {#notes}

#### Development {#development-notes}

- Run the development server with `rails s`.
- The default port is 3001.
  - So when running, the api can be accessed at [localhost:3001](http://localhost:3001/).
- Update the `origins "http://localhost:3000"` line of `config/initializers/cors.rb` with the development URL of your frontend.
- Update both `key` values of `config/initializers/session_store.rb` with the name of your app.

#### Production {#production-notes}

- Update the `origins "https://myappurl.com"` line of `config/initializers/cors.rb` with the production URL of your frontend.
- Update the `domain` value of `config/initializers/session_store.rb` with the production URL of your API.

## Authentication {#authentication}

This template includes authentication setup using `has_secure_password`. This includes:

- A [**User**](https://github.com/jro31/rails-api-template/blob/master/app/models/user.rb) model with email/password validations (and [specs](https://github.com/jro31/rails-api-template/blob/master/spec/models/user_spec.rb) for these validations).
- A [**registrations controller**](https://github.com/jro31/rails-api-template/blob/master/app/controllers/api/v1/registrations_controller.rb) that includes a `#create` action:

  - This action allows a user to register (sign-up).
  - If successful, it returns the status `:created` (201), with a json that includes the user ID, and the user email.
  - If unsuccessful, it returns the status `:unprocessable_entity` (422) with an error message.
  - This action has a [**request spec**](https://github.com/jro31/rails-api-template/blob/master/spec/requests/api/v1/registrations_spec.rb).

- A [**sessions controller**](https://github.com/jro31/rails-api-template/blob/master/app/controllers/api/v1/sessions_controller.rb) that has three actions:

  - The `#create` action allows a user to login.
    - If they provide a correct email/password combo, it returns the status `:created` (201), with a json that includes the user ID, and the user email.
    - Otherwise it returns the status `:unauthorized` (401) with an error message.
  - The `#logged_in` action utilises the [CurrentUserConcern](https://github.com/jro31/rails-api-template/blob/master/app/controllers/concerns/current_user_concern.rb) to check if a user is logged-in.
    - If they are it returns `logged_in: true` and the user, if not it returns `logged_in: false`.
  - The `#logout` action allows a user to logout.

  - All actions have [**request specs**](https://github.com/jro31/rails-api-template/blob/master/spec/requests/api/v1/sessions_spec.rb).

## Endpoints {#endpoints}

### `GET` `http://localhost:3001/` {#root-endpoint}

- Root, to check that the API is working.

### `POST` `http://localhost:3001/api/v1/registrations` {#registrations-create-endpoint}

- To register a user.
- Requires a `user` param containing an `email`, `password` and `password_confirmation`, for example:

```js
fetch('http://localhost:3001/api/v1/registrations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    user: {
      email: 'example@email.com',
      password: 'password',
      password_confirmation: 'password',
    },
  }),
  credentials: 'include',
});
```

### `POST` `http://localhost:3001/api/v1/sessions` {#sessions-create-endpoint}

- To create a session (login a user).
- Requires a `user` param containing an `email` and `password`, for example:

```js
fetch('http://localhost:3001/api/v1/sessions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    user: {
      email: 'example@email.com',
      password: 'password',
    },
  }),
  credentials: 'include',
});
```

### `GET` `http://localhost:3001/api/v1/logged_in` {#logged-in-endpoint}

- To check if a user is logged-in.
- Example request:

```js
fetch('http://localhost:3001/api/v1/logged_in', {
  credentials: 'include',
});
```

### `DELETE` `http://localhost:3001/api/v1/logout` {#logout-endpoint}

- To logout a user.
- Example request:

```js
fetch('http://localhost:3001/api/v1/logout', {
  method: 'DELETE',
  credentials: 'include',
});
```
