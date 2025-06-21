# Login UI Demo
## About
The backend server and exposed api powering the frontend client. Cors restricts access to expected client.

## Stack
- [x] Typescript
- [x] Express
- [x] Prisma ORM with PostgreSQL
- [x] Argon2 for hashing
- [x] JsonWebToken


## Routes
- The api is versioned and exposed via the url `/api/<version_number>`. As the current version is v1, the api is available at the baseURL `/api/v1`.
- The endpoints are:
  - `/signup`: for user registration. Returns a JSON with new user's `id` on success.
  - `/auth/login`: handles login. Returns User's profile on success.
     - Uses `authToken`, which is a `jwt` for secure auth flow.
  - `/auth/logout`: handles logout. Returns a status 200 on success.
  - `/status`: api health check. Returns a json with message: "OK" if all checks tick.

## Live Preview
You can preview the application [here](https://login-ui-drs5.onrender.com)

