// https://github.com/denoland/saaskit/blob/main/plugins/session.ts

import { Plugin } from "$fresh/server.ts";
import type { FreshContext } from "$fresh/server.ts";
import { User } from "@utils/db.ts";

export interface State {
  user?: User;
}

export type SignedInState = Required<State>;

export function assertSignedIn(
  ctx: { state: State },
): asserts ctx is { state: SignedInState } {
  if (!ctx.state.user) {
    throw new Error("User is not signed in");
  }
}

async function ensureSignedIn(
  _req: Request,
  ctx: FreshContext<State>,
) {
  try {
    assertSignedIn(ctx);
  } catch {
    return new Response(null, { headers: { location: "/signin" }, status: 302 });
  }

  return await ctx.next();
}

export default {
  name: "session",
  middlewares: [
    {
      path: "/upload",
      middleware: { handler: ensureSignedIn },
    },
    {
      path: "/edit",
      middleware: { handler: ensureSignedIn },
    }
  ],
} as Plugin<State>;
