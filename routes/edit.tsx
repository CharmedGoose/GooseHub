import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { getUser, getVideoById, updateThumbnail, updateVideo, User, Video } from "@utils/db.ts";
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
    const upload = ctx.url.searchParams.get("upload") == "1";

    const video = await CheckUserAndVideo(ctx);
    if (video instanceof Response) return video;

    return await ctx.render({ video, upload });
  },
  async POST(req, ctx) {
    const upload = ctx.url.searchParams.get("upload") == "1";

    const video = await CheckUserAndVideo(ctx);
    if (video instanceof Response) return video;

    const form = await req.formData();
    const thumbnail = form.get("thumbnail") as File;
    const title = form.get("title") as string;
    const description = form.get("description") as string;

    if (thumbnail) {
      await updateThumbnail(video, thumbnail);
    }
    if (title) {
      video.name = title;
    }
    if (description) {
      video.description = description;
    }

    await updateVideo(video);

    return ctx.render({ video, upload });
  },
};

export default function Upload(props: PageProps<EditProps>) {
  const { video, upload } = props.data;

  return (
    <EditVideo video={video} isUpload={upload} />
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
  const user = await getUser(video.user);
  if (!user) {
    return ctx.renderNotFound();
  }

  if (
    user.id !== ctx.state.user.id
  ) {
    return ctx.renderNotFound();
  }

  return video;
}
