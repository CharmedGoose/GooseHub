import { type PageProps } from "$fresh/server.ts";
import Navbar from "../components/Navbar.tsx";
import { User } from "../utils/db.ts";
export default function App({ Component, state }: PageProps) {
  return (
    <html class="bg-black">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GooseHub</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Navbar user={state.user as User | undefined} />
        <Component />
      </body>
    </html>
  );
}
