# Spots API

## How to start this express app

1. Clone this repository
2. Navigate to the root directory of this repository using command: `cd <path/to/this/repository>`
3. Change `.env.example` to `.env` and fill the environment variables
4. You can create `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` randomly utilizing this command: <br> `node -e "console.log(require('crypto').randomBytes(64).toString('base64'));"`
5. Install dependencies using command: `npm install` or simply `yarn`
6. Push prisma schema to database using command: `npx prisma db push`
7. Run this express app using command: `npm run dev` or `yarn dev`

n.p. seeder soon to be added