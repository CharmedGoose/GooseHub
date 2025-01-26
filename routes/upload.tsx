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
    <div>
      {uploaded
        ? (
          <div>
            <h1>Upload Successful</h1>
          </div>
        )
        : (
          // I used github copilot to help write this part cause i'm dumb and don't know how to do it
          <div class="flex flex-row h-[calc(100vh-70px)] justify-center items-center text-white">
            <div class="max-w-md w-full p-8 bg-zinc-900 rounded-lg">
              <h1 class="text-2xl font-bold text-center mb-6">
                Upload Video
              </h1>
              {message
                ? (
                  <h2 class="text-lg text-center mb-6 text-red-700">
                    {message}
                  </h2>
                )
                : null}
              <form
                method="post"
                encType="multipart/form-data"
                class="space-y-4"
              >
                <input
                  type="file"
                  name="video-file"
                  accept=".mp4"
                  class="file-input w-full bg-zinc-700 text-white border-zinc-600 hover:border-orange-400"
                />
                <button type="submit" class="btn w-full">Upload</button>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}
