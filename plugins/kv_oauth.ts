import type { Plugin } from "$fresh/server.ts";
import {
  createOrUpdateUser,
  deleteUserBySession,
  getUser,
  User,
} from "@utils/db.ts";
import helpers from "@utils/oauth.ts";

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
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
        if (req.url.includes("error=access_denied")) {
          return new Response(null, { status: 302, headers: { Location: "/" } });
        }

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

        const user = await getUser(discordUser.id);

        if (user) {
          await deleteUserBySession(user.sessionId);
          await createOrUpdateUser({ ...user, sessionId });
        } else {
          const newUser: User = {
            id: discordUser.id,
            sessionId,
            username: discordUser.username,
            avatar: discordUser.avatar,
          };

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
