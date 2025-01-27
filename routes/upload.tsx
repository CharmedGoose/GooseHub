import { Handlers, type PageProps } from "$fresh/server.ts";
import { uploadVideo, User } from "@utils/db.ts";
import UploadVideo from "@islands/UploadVideo.tsx";

export interface UploadProps {
  message: string | null;
}

export const handler: Handlers<UploadProps> = {
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

    let id: string;

    try {
      id = await uploadVideo(file, ctx.state.user as User);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : "An unknown error occurred";
      return ctx.render({
        message: errorMessage,
      });
    }

    return new Response(null, {
      status: 303,
      headers: {
        Location: `/edit?v=${id}`,
      },
    });
  },
};

export default function Upload(props: PageProps<UploadProps>) {
  const { message } = props.data;

  return (
    <main class="flex flex-row h-[calc(100vh-90px)] justify-center items-center">
      <UploadVideo message={message} />
    </main>
  );
}
