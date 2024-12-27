import type { Plugin } from "$fresh/server.ts";
import helpers from "../utils/oauth.ts";

export default {
  name: "kv-oauth",
  routes: [ 
    {
      path: "/signin",
      async handler(req) {
        return await helpers.signIn(req);
      },
    },
    {
      path: "/callback",
      async handler(req) {
        // Return object also includes `accessToken` and `sessionId` properties.
        const { response } = await helpers.handleCallback(req);
        return response;
      },
    },
    {
      path: "/signout",
      async handler(req) {
        return await helpers.signOut(req);
      },
    },
    {
      path: "/protected",
      async handler(req) {
        return await helpers.getSessionId(req) === undefined
          ? new Response("Unauthorized", { status: 401 })
          : new Response("You are allowed");
      },
    },
  ],
} as Plugin;