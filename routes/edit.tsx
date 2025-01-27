import { defineRoute } from "$fresh/server.ts";
import { getVideoById, User } from "@utils/db.ts";
import EditVideo from "@islands/EditVideo.tsx";

interface State {
  user: User;
}

export default defineRoute<State>(async (_req, ctx) => {
  const id = ctx.url.searchParams.get("v");
  if (!id) {
    return new Response("", {
      status: 301,
      headers: { Location: "/" },
    });
  }

  const video = await getVideoById(id);

  if (!video) {
    return ctx.renderNotFound();
  }
  if (
    (video.user.id !== ctx.state.user.id) &&
    (video.user.email !== ctx.state.user.email)
  ) {
    return ctx.renderNotFound();
  }

  return (
    <main class="flex flex-row h-[calc(100vh-90px)] justify-center items-center">
      <EditVideo video={video} />
    </main>
  );
});
