import Navbar from "@components/Navbar.tsx";
import { User } from "@utils/db.ts";
import { defineApp } from "$fresh/server.ts";

export default defineApp<{ user: User }>((_req, ctx) => {
  return (
    <html class="bg-black">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GooseHub</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Navbar user={ctx.state.user as User | undefined} url={ctx.route} />
        <ctx.Component />
      </body>
    </html>
  );
});
