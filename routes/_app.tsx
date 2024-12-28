import { type PageProps } from "$fresh/server.ts";
import Navbar from "../components/Navbar.tsx";
export default function App({ Component, state }: PageProps) {
  return (
    <html class="bg-black">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GooseHub</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <Navbar sessionId={state.sessionId as string | undefined} />
        <Component />
      </body>
    </html>
  );
}
