import type { Plugin } from "$fresh/server.ts";
import { User, createOrUpdateUser, deleteUserBySession, getUser } from "../utils/db.ts";
import helpers from "../utils/oauth.ts";

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  email: string;
  verified: boolean;
}

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
        const { response, sessionId, tokens } = await helpers.handleCallback(
          req,
        );

        const discordResponse = await fetch(
          "https://discord.com/api/users/@me",
          {
            headers: {
              Authorization: `${tokens.tokenType} ${tokens.accessToken}`,
            },
          },
        );

        const discordUser: DiscordUser = await discordResponse.json();

        if (!discordUser.verified) return new Response("Email not verified", { status: 400 });

        const user = await getUser(discordUser.id);

        if (user) {
          await deleteUserBySession(sessionId);
          await createOrUpdateUser({ ...user, sessionId });
        } else {
          const newUser: User = {
            id: discordUser.id,
            sessionId,
            username: discordUser.username,
            avatar: discordUser.avatar,
            email: discordUser.email,
          }

          await createOrUpdateUser(newUser);
        }

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
