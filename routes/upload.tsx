import { Handlers, type PageProps } from "$fresh/server.ts";
import { uploadVideo, User } from "@utils/db.ts";

interface Props {
  message: string | null;
  uploaded: boolean;
}

export const handler: Handlers<Props> = {
  async GET(_req, ctx) {
    return await ctx.render({
      message: null,
      uploaded: false,
    });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const file = form.get("video-file") as File;

    if (!file) {
      return ctx.render({
        message: "No file chosen.",
        uploaded: false,
      });
    }

    if (file.type !== "video/mp4") {
      return ctx.render({
        message: "File type unsupported.",
        uploaded: false,
      });
    }

    try {
      await uploadVideo(file, ctx.state.user as User);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : "An unknown error occurred";
      return ctx.render({
        message: errorMessage,
        uploaded: false,
      });
    }

    return ctx.render({
      message: `${file.name} uploaded.`,
      uploaded: true,
    });
  },
};

export default function Upload(props: PageProps<Props>) {
  const { message, uploaded } = props.data;

  return (
    <main class="flex flex-row h-[calc(100vh-70px)] justify-center items-center">
      {uploaded
        ? <h1 class="text-3xl text-white">Upload Successful</h1>
        : (
          <div class="card bg-zinc-900 w-96">
            <div class="card-body items-center text-center">
              <h2 class="card-title mb-3">Upload Video</h2>
              {message ? <p class="text-red-600 mb-3">{message}</p> : null}
              <form
                method="post"
                encType="multipart/form-data"
                class="space-y-4"
              >
                <input
                  type="file"
                  name="video-file"
                  accept=".mp4"
                  class="file-input file-input-bordered w-full max-w-xs bg-zinc-700 text-white hover:border-orange-400"
                />
                <div class="card-actions justify-end">
                  <button class="btn w-full">Upload!</button>
                </div>
              </form>
            </div>
          </div>
        )}
    </main>
  );
}
