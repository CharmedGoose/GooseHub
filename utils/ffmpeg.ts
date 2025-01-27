export async function generateThumbnailFromVideo(
  path: string,
  id: string,
): Promise<string> {
  const thumbnailProcess = new Deno.Command("ffmpeg", {
    args: [
      "-i",
      path,
      "-ss",
      "00:00:01.000",
      "-vf",
      "scale=1280:720:force_original_aspect_ratio=decrease",
      "-qscale:v",
      "4",
      "-vframes",
      "1",
      `./tmp/${id}.jpg`,
    ],
    stdout: "null",
    stdin: "null",
    stderr: "null",
  }).spawn();

  const status = await thumbnailProcess.status;
  if (status.code) throw new Error("Failed to generate thumbnail");

  return `./tmp/${id}.jpg`;
}
