import { defineRoute } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { getVideoById, pathToDB } from "@utils/db.ts";

export default defineRoute(async (_req, ctx) => {
  const { id } = ctx.params;
  const video = await getVideoById(id);
  if (!video) {
    return ctx.renderNotFound();
  }

  return (
    <main class="h-[calc(100vh-70px)] flex items-center justify-center">
      <Head>
        <link
          href="https://vjs.zencdn.net/8.16.1/video-js.css"
          rel="stylesheet"
        />
      </Head>
        <video
        id="video"
        class="video-js vjs-fill"
        controls
        preload="auto"
        poster={`${pathToDB}/${video.bucket}/${video.thumbnail}`}
        data-setup="{}"
      >
        <source
          src={`${pathToDB}/${video.bucket}/${video.path}`}
          type="video/mp4"
        />
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video>
      <script src="https://vjs.zencdn.net/8.16.1/video.min.js"></script>
    </main>
  );
});
