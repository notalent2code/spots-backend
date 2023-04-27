# Spots API

## How to start this express app

1. Clone this repository
2. Navigate to the root directory of this repository using command: `cd <path/to/this/repository>`
3. Change `.env.example` to `.env` and fill the environment variables
4. You can create `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` randomly utilizing this command: <br> `node -e "console.log(require('crypto').randomBytes(64).toString('base64'));"`
5. Install dependencies using command: `npm install` or simply `yarn`
6. Push prisma schema to database using command: `npx prisma db push`
7. Run this express app using command: `npm run dev` or `yarn dev`

note: seeder soon to be added

## API Documentation

You can check API documentation [here](https://documenter.getpostman.com/view/18486727/2s93Y5PfQQ)

## Acknowledgements

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)