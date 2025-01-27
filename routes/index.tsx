import { getAllVideos } from "@utils/db.ts";
import { defineRoute } from "$fresh/server.ts";

export default defineRoute(async () => {
  const videos = await getAllVideos();

  return (
    <main class="min-h-[calc(100vh-90px)]">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map(({ video, thumbnail }) => (
            <a href={`/watch?v=${video.id}`}>
              <div class="card card-compact bg-base-200 hover:bg-base-300 h-full">
                <figure class="aspect-video">
                  <img
                    src={thumbnail}
                    alt={video.name}
                  />
                </figure>
                <div class="card-body">
                  <h2 class="card-title text-orange-400">{video.name}</h2>
                  <p>{video.description}</p>

                  <div class="card-actions justify-end">
                    <div class="badge">{video.views} views</div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
});