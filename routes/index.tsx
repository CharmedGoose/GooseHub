import { getAllVideos } from "@utils/db.ts";
import { defineRoute } from "$fresh/server.ts";
import Duration from "https://deno.land/x/durationjs@v4.0.0/mod.ts";

export default defineRoute(async () => {
  const videos = await getAllVideos();

  return (
    <main class="min-h-[calc(100vh-90px)]">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map(({ video, thumbnail }) => (
            <a href={`/watch?v=${video.id}`}>
              <div class="card card-compact bg-base-200 hover:bg-base-300 h-full">
                <figure class="aspect-video relative">
                  <img
                    src={thumbnail}
                    alt={video.name}
                  />
                  <div className="badge badge-outline absolute bottom-2 right-2 bg-black bg-opacity-60">
                    {(() => {
                      const d = new Duration(video.duration * 1000);
                      return `${d.m}:${d.s.toString().padStart(2, "0")}`;
                    })()}
                  </div>
                </figure>
                <div class="card-body">
                  <h2 class="card-title text-orange-400 w-65 truncate">
                    {video.name}
                  </h2>
                  <p class="w-65 truncate">{video.description}</p>
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
