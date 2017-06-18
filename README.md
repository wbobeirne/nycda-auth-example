# NYCDA Auth Example

This example project that we'll walk through together is meant to demonstrate
how to set up a very simple user creation and authorization flow. We'll be
updating it along the way.

## Getting started

Follow these steps to get the app working, before we start building on it:

1) Run `npm install` to install all the necessary modules
2) Create a new Postgres database for out project (e.g. `auth_example`)
3) Create a `.env` file that specifies db name, user, and password, e.g.
```
DB_NAME=auth_example
DB_USER=postgres
DB_PASSWORD=p4ssw0rd
```
4) Run `npm start` and make sure it all works without errors
