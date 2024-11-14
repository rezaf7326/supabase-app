<h1 align="center">A Super Simple Next.js and Supabase App</h1>

### Setup Locally:

After you've **git-cloned** the project, take the Steps below to get the application running on your machine.

1. Install dependencies:

   ```bash
   npm i
   ```

2. To run the Next.js application:

   ```bash
   npm run dev
   # OR
   npm run build && npm start
   ```

   Should then now be running on [localhost:3000](http://localhost:3000/).

Now go ahead to the register/login page and do needs doing!
After a successful login, you will be in the `/protected` page and will view a table of books...

### Explaination:

- The app connects to a Supabase project as the backend service using the _@supabase_ npm package (Supabase sdk).
- Authentication and athorization is done via Supabase.
- The only API implemented is `GET /books` which is provided by an edge-function deployed to the same Supabase project (implementations are in the **root** of this repo at `supabase/functions`).
- To test this application you will need the **._env_** file values that is at the root of this project (and **NOT** the one at the `supabase/functions`).
