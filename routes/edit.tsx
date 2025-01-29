import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { getVideoById, User, Video } from "@utils/db.ts";
import EditVideo from "@islands/EditVideo.tsx";

interface State {
  user: User;
}

interface EditProps {
  video: Video;
  upload: boolean;
}

export const handler: Handlers<EditProps, State> = {
  async GET(_req, ctx) {
    const upload = ctx.url.searchParams.get("upload");

    const video = await CheckUserAndVideo(ctx);
    if (video instanceof Response) return video;

    return await ctx.render({ video, upload: upload == "1" });
  },
  async POST(req, ctx) {
    const upload = ctx.url.searchParams.get("upload");

    const video = await CheckUserAndVideo(ctx);
    if (video instanceof Response) return video;

    const form = await req.formData();
    const thumbnail = form.get("thumbnail-file") as File;

    console.log(thumbnail.name);

    if (thumbnail) {
      return ctx.render({ video, upload: upload == "1" });
    }

    return ctx.render({ video, upload: upload == "1" });
  },
};

export default function Upload(props: PageProps<EditProps>) {
  const { video, upload } = props.data;

  return (
    <main class="flex flex-row h-[calc(100vh-90px)] justify-center items-center">
      <EditVideo video={video} isUpload={upload} />
    </main>
  );
}

async function CheckUserAndVideo(ctx: FreshContext<State>) {
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

  return video;
}
