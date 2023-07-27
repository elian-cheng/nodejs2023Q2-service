# Home Library Service

Repository for Home Library Service task at RS School's NodeJS 2023 Q2 course.  
[Task description](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/rest-service/assignment.md)

### Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

### Download

```
git clone https://github.com/elian-cheng/nodejs2023Q2-service.git
```
### Move to the app folder

```
cd nodejs2023Q2-service
```

### Switch to the necessary branch

```
git checkout part-1
```

### Install NPM modules

```
npm install
```

### Run the application

```
npm start
```

Application start on `http://localhost:4000` by default. You can change the port in .env file. There is an `example.env` file in the root of the project, remove the `example` prefix and you can use it.

### How to work with the app

1. Using Postman.
2. Using the capabilities of the Open API - `http://localhost:4000/doc/` address in your browser.

## API

Available endpoints:

`/user` route - to operate with `Users`:

- `GET /user` - to get all users

- `GET /user/:id` - get single user by id (uuid)

- `POST /user` - create user with required fields:

  ```
  {
    login: string,
    password: string,
  }
  ```

- `PUT /user/:id` - update user's password with required fields:

  ```
  {
    oldPassword: string,
    newPassword: string,
  }
  ```

- `DELETE /user/:id` - delete user

`/track` route - to operate with `Tracks`:

- `GET /track` - get all tracks

- `GET /track/:id` - get single track by id

- `POST /track` - create new track with required fields:

  ```
  {
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  }
  ```

- `PUT /track/:id` - update track info

- `DELETE /track/:id` - delete track

`/artist` route - to operate with `Artists`:

- `GET /artist` - get all artists

- `GET /artist/:id` - get single artist by id

- `POST /artist` - create new artist with required fields:

  ```
  {
    name: string,
    grammy: boolean,
  }
  ```

- `PUT /artist/:id` - update artist info

- `DELETE /artist/:id` - delete artist

`/album` route - to operate with `Albums`:

- `GET /album` - get all albums

- `GET /album/:id` - get single album by id

- `POST /album` - create new album with required fields:

  ```
  {
    name: string,
    year: number,
    artistId: string | null,
  }
  ```

- `PUT /album/:id` - update album info

- `DELETE /album/:id` - delete album

`/favs` route - to operate with `Favorites`:

- `GET /favs` - get all favorites

- `POST /favs/track/:id` - add track to the favorite

- `DELETE /favs/track/:id` - delete track from favorites

- `POST /favs/album/:id` - add album to the favorites

- `DELETE /favs/album/:id` - delete album from favorites

- `POST /favs/artist/:id` - add artist to the favorites

- `DELETE /favs/artist/:id` - delete artist from favorites

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```
