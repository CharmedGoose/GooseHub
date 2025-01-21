import { getAllVideos, Video } from "@utils/db.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import internal from "node:stream";

interface Props {
  videos: { video: Video; thumbnail: internal.Readable }[];
}

export const handler: Handlers<Props> = {
  async GET(_req, ctx) {
    const videos = await getAllVideos();
    return await ctx.render({ videos });
  },
}

export default function Home(props: PageProps<Props>) {
  return (
    <main>
      <div class="px-4 py-8 mx-auto">
        <h1 class="max-w-screen-md mx-auto flex flex-col items-center justify-center text-white text-3xl">
          {props.data.videos.map((video) => (video.thumbnail))}
        </h1>
      </div>
    </main>
  );
}
