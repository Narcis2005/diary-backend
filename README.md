# Diary - backend

Diary is a web application where you can let your emotions fly, by writing them in your personal and private diary. After that, just download it. You can even print it then.

## Features

-   Login/Register
-   Write/edit diary
-   See profile info
-   Edit profile info
-   Download diary in pdf
-   All diary content is encrypted
-   Automatic formating of content is pages on diary save
-   Responsive design
-   Server side rendering

## Upcoming features

-   Customize your diary design
-   Delete account
-   Google, Facebook auth
-   More testing
-   Change password
-   Rich text editor (maybe)

## Tech

-   Next
-   Node
-   Express
-   Redux Toolkit
-   Styled Components
-   Typescript
-   Json web token based auth with refresh tokens
-   Postgresql
-   Sequelize
-   Jest, Mocha
-   Docker

## Demo

You can interact with the project
[here](https://diary.chirilovnarcis.ro).

[![Photo of the main page](https://i.im.ge/2022/08/13/OoKXrS.diary-chirilovnarcis-ro-1.png)](https://im.ge/i/OoKXrS)

## Installation

Requires [Node.js](https://nodejs.org/) v14+ to run ,typescript and mongodb. This only runs the frontend. To run the frontend please visit [this](https://github.com/Narcis2005/diary-frontend)

### Install the dependencies and run the app

Before any of that you will need to create a .env file in the root directory with the following variables:

```
SECRET= jwt secret
REFRESH_SECRET=jwt refresh token secret
DB_HOST= host of db
DB_USERNAME= username of db
DB_PASSWORD= password of db
DATABASE_NAME= name of db
DIARY_SECRET= secret for encrypting diary content
```

#### With simple npm

```sh
npm i
npm run start
```

#### Or by using docker. THE DB IS NOT PART OF DOCKER. YOU WILL NEED TO HAVE ONE INSTALLED ON YOUR MACHINE

```sh
docker build -t backend-diary .
docker run --user=node --volume=YOUR ABSOLUTE PATH TO THE FOLDER WHERE IMAGES WILL BE STORED:/usr/src/app/dist/static/uploads/images:rw --network=host --privileged --restart=unless-stopped --detach=true --name=backend-diary backend-diary
```

## API

### POST api/register - public

You can create an account

#### Parameters

Required:

-   fullName - user's full name
-   username: the username of the user
-   password: the password of the user
-   email: the email of the user

#### Response

It could be a json with the following syntax, or with no response at all:

```javascript
{
    message ?: string,
}
```

The response headers will have 2 more proprieties if everything is succesfull: `x-token` and `x-refresh-token` .

### POST api/login - public

You login

#### Parameters

Required:

-   username: the username of the user
-   password: the password of the user

#### Response

It will be a json with the following syntax:

```typescript
{
    message: string,
    id?: number,
    fullName?: string,
    email?: string;
    imageURL?: string;
}
```

The response headers will have 2 more proprieties if everything is succesfull: `x-token` and `x-refresh-token` .

### GET api/getuser - public

You get the user info based on token

#### Parameters

Required:

-   headers:
    -   x-token: the token auth

Optional:

-   headers:
    -   x-refresh-token: if the token is expired use this to generate a new one

#### Response

It will be a json with the following syntax:

```typescript
{
    message: string,
    id?: number,
    fullName?: string,
    email?: string;
    imageURL?: string;
}
```

The response headers will have 2 more proprieties if everything is succesfull: `x-token` and `x-refresh-token` .

### PUT api/update - private

Update the user info

#### Parameters

Required:

-   At least one of the optional parameteres

Optional:

-   username
-   fullName
-   email
-   imageName - if you want to change the image, you first need to call another endpoint to upload the image

#### Response

It could be a json with the following syntax, or with no response at all:

```typescript
{
    message?: string,
}
```

## License

-   MIT License
-   Copyright 2022 © [Chirilov Narcis](https://chirilovnarcis.ro)
