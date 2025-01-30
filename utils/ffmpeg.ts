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

export async function getVideoDuration(video: File): Promise<number> {
  const UUID = crypto.randomUUID();

  const videoPath = `./tmp/${UUID}.mp4`;
  await Deno.writeFile(videoPath, video.stream());
  
  const process = new Deno.Command("ffprobe", {
    args: [
      "-v",
      "quiet",
      "-print_format",
      "json",
      "-show_format",
      videoPath,
    ],
    stdout: "piped",
    stderr: "null",
  }).spawn();

  if ((await process.status).code) throw new Error("Failed to get video duration");

  const { stdout } = await process.output();
  const info = JSON.parse(new TextDecoder().decode(stdout));
  const duration = Math.floor(parseFloat(info.format.duration) || 0);

  await Deno.remove(videoPath);
  return duration;
}
