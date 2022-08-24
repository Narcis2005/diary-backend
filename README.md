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
-   Change password
-   Forgot password
-   Delete account

## Upcoming features

-   Customize your diary design
-   Google, Facebook auth
-   More testing
-   Rich text editor (maybe)
-   Recaptcha
-   Analytics

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
EMAIL_ADRESS= gmail email adress
REFRESH_TOKEN_EMAIL= refresh token linked to gmail account
CLIENT_ID_EMAIL= client id for gmail account
DELETE_TOKEN= jwt secret for delete account
RESET_TOKEN= jwt secret for reset password
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

### "Access private" means that the authorization header(s) need to exist and be valid

### POST api/auth/register - public

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

### POST api/auth/login - public

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

### GET api/auth/getuser - public

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

### PUT api/auth/update - private

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

### POST api/auth/send-delete-account-email - private

Sends an email with a delete account link to the email linked with the account

#### Parameters

Required:

-   password - the password of the account

#### Response

It will be a json with the following syntax:

```typescript
{
    message: string,
}
```

### POST api/auth/send-reset-password-email - private

Sends an email with a reset password link to the email linked with the account

#### Parameters

none

#### Response

It will be a json with the following syntax:

```typescript
{
    message: string,
}
```

### PUT api/auth/reset-password - public

After recevieng an email with a link that calls this endpoint, you can reset your password.

#### Parameters

Required:

-   newPassword - your new password
-   repeatedNewPassword - the same new password
-   token - the token from the url received on email

#### Response

It will be a json with the following syntax:

```typescript
{
    message: string,
}
```

### DELETE api/auth/delete - public

After recevieng an email with a link that calls this endpoint, you can delete your account.

#### Parameters

Required:

-   token - the token from the url received on email

#### Response

It will be a json with the following syntax:

```typescript
{
    message: string,
}
```

### POST api/contact - public

Send me an email

#### Parameters

Required:

-   email: The user's email;
-   fullName: The user's fullName;
-   subject: The user's subject;
-   message: The user's message;

#### Response

It will be a json with the following syntax:

```typescript
{
    message: string,
}
```

### GET api/diary - private

Get the diary of an user

#### Parameters

none

#### Response

It will be a json array with the following syntax:

```typescript
[
    {
        id: string,
        updatedAt: Date,
        createdAt: Date,
        userId: string,
        content: string,
    },
];
```

### PUT api/diary/update-diary - private

Update the diary.

#### Parameters

Required:

Representing an array of diaryEntries that you wish to change

[{

-   data: Date;
-   id: number;
-   content: string;
-   date: Date;
-   isNewEntry: boolean,

}]

#### Response

It will be a json with the following syntax:

```typescript
{
    message: string,
}
```

### GET api/diary/download - private

Download your diary in pdf

#### Parameters

none

#### Response

It will be a pdf.

### POST api/upload - private

Upload a photo for the profile picture.

#### Parameters

It's a form-data request

Required:

file: the actual file in png, jpg or webp

#### Response

A string with the photo name.

## License

-   MIT License
-   Copyright 2022 © [Chirilov Narcis](https://chirilovnarcis.ro)
