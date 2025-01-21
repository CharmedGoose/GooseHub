import { FreshContext } from "$fresh/server.ts";
import { getUserBySession, User } from "@utils/db.ts";
import handlers from "@utils/oauth.ts";

interface State {
  sessionId?: string;
  user?: User;
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
) {
  const sessionId = await handlers.getSessionId(req);

  ctx.state.sessionId = sessionId;

  if (sessionId) {
    const user = await getUserBySession(sessionId);
    if (user) ctx.state.user = user;
  }

  return await ctx.next();
}
