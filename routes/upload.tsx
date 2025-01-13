import { Handlers, type PageProps } from "$fresh/server.ts";

interface Props {
  message: string | null;
}

export const handler: Handlers<Props> = {
  async GET(_req, ctx) {
    return await ctx.render({
      message: null,
    });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const file = form.get("video-file") as File;

    if (!file) {
      return ctx.render({
        message: "No file chosen.",
      });
    }

    return ctx.render({
      message: `${file.name} uploaded.`,
    });
  },
};

export default function Upload(props: PageProps<Props>) {
  const { message } = props.data;
  return (
    <main>
      {/* I used github copilot to help write this part cause i'm dumb and don't know how to do it */}
      <div class="flex flex-row h-[calc(100vh-70px)] justify-center items-center text-white">
        <div class="max-w-md w-full p-8 bg-zinc-900 rounded-lg">
          <h1 class="text-2xl font-bold text-center mb-6">
            Upload Video
          </h1>
          {message
            ? <h2 class="text-lg text-center mb-6 text-red-700">{message}</h2>
            : null}
          <form
            method="post"
            encType="multipart/form-data"
            class="space-y-4"
          >
            <input
              type="file"
              name="video-file"
              class="file-input w-full bg-zinc-700 text-white border-zinc-600 hover:border-orange-400"
            />
            <button type="submit" class="btn w-full">Upload</button>
          </form>
        </div>
      </div>
    </main>
  );
}
