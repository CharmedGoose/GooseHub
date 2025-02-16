export async function generateThumbnailFromVideo(
  path: string,
): Promise<string> {
  const tmpPath = await Deno.makeTempFile({ suffix: ".jpg" });
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
      tmpPath,
    ],
    stdout: "null",
    stdin: "null",
    stderr: "null",
  }).spawn();

  const status = await thumbnailProcess.status;
  if (status.code) {
    await Deno.remove(tmpPath);
    throw new Error("Failed to generate thumbnail");
  }

  return tmpPath;
}

export async function getVideoDuration(video: File): Promise<number> {
  const tmpPath = await Deno.makeTempFile({ suffix: video.name.split(".").pop() });
  await Deno.writeFile(tmpPath, video.stream());

  const process = new Deno.Command("ffprobe", {
    args: [
      "-v",
      "quiet",
      "-print_format",
      "json",
      "-show_format",
      tmpPath,
    ],
    stdout: "piped",
    stdin: "null",
    stderr: "null",
  }).spawn();

  if ((await process.status).code) {
    await Deno.remove(tmpPath);
    throw new Error("Failed to get video duration");
  }

  const { stdout } = await process.output();
  const info = JSON.parse(new TextDecoder().decode(stdout));
  const duration = Math.floor(parseFloat(info.format.duration) || 0);

  await Deno.remove(tmpPath);
  return duration;
}
