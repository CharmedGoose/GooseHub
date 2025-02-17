import { defineRoute, Handlers } from "$fresh/server.ts";
import APITOKEN from "@islands/APIToken.tsx";
import { resetUserAPIToken, User } from "@utils/db.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    return await ctx.render({
      message: null,
    });
  },
  async POST(_req, ctx) {
    if (!ctx.state.user) {
      return new Response("401 Unauthorized", { status: 401 });
    }
    
    const token = await resetUserAPIToken(ctx.state.user as User);

    return new Response(null, { headers: { "apiKey": token } });
  },
};

export default defineRoute<{ user: User }>((_req, ctx) => {
  return (
    <main>
      <div className="hero bg-base-200 rounded-lg">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">API Token</h1>
            <p className="py-6">
              Get your API token here!<br/>
            </p>
            <APITOKEN user={ctx.state.user} />
          </div>
        </div>
      </div>
    </main>
  );
});
