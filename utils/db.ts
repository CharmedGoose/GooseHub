// Tutorial: https://youtu.be/8jRuV9P5_gA
/// <reference lib="deno.unstable" />

import { Buffer } from "node:buffer";
import internal from "node:stream";
// @ts-types="minio/dist/esm/minio.d.mts"
import * as Minio from "minio";

const kv = await Deno.openKv();

const endPoint = Deno.env.get("MINIO_ENDPOINT") || "localhost";
const port = Number(Deno.env.get("MINIO_PORT"));
const useSSL = Boolean(Deno.env.get("MINIO_USE_SSL"));
const bucket = Deno.env.get("MINIO_BUCKET_NAME") || "my_bucket";

const minio = new Minio.Client({
  endPoint: endPoint,
  port: port,
  useSSL: useSSL,
  accessKey: Deno.env.get("MINIO_ACCESS_KEY"),
  secretKey: Deno.env.get("MINIO_SECRET_KEY"),
  region: Deno.env.get("MINIO_REGION"),
});

export interface User {
  id: string;
  sessionId: string;
  username: string;
  avatar: string;
  email: string;
}

export interface Video {
  id: string;
  name: string;
  path: string;
  thumbnail: string;
  bucket: string;
  user: User;
  description?: string;
  views: number;
  likes: number;
  dislikes: number;
  comments: string[];
}

export async function createOrUpdateUser(user: User) {
  const userKey = ["users", user.id];
  const userBySessionKey = [
    "users_by_session",
    user.sessionId,
  ];

  const response = await kv.atomic()
    .set(userKey, user)
    .set(userBySessionKey, user)
    .commit();

  if (!response.ok) {
    throw new Error("Failed to create or update user");
  }
}

export async function deleteUserBySession(sessionId: string) {
  await kv.delete(["users_by_session", sessionId]);
}

export async function getUserBySession(
  sessionId: string,
): Promise<User | null> {
  const userBySessionKey = ["users_by_session", sessionId];
  const resp = await kv.get<User>(userBySessionKey);
  return resp.value;
}

export async function getUser(id: string): Promise<User | null> {
  const userKey = ["users", id];
  const resp = await kv.get<User>(userKey);
  return resp.value;
}

export async function uploadVideo(video: File, user: User) {
  if (video.type !== "video/mp4") {
    throw new Error("File type unsupported");
  }

  if (!(await minio.bucketExists(bucket))) {
    await createBucket();
  }

  await Deno.mkdir("./tmp").catch((err) => {
    if (!(err instanceof Deno.errors.AlreadyExists)) {
      throw err;
    }
  });

  const name = video.name.replace(/\.[^/.]+$/, "");
  const videoType = video.name.split(".").pop();
  const id = Date.now().toString(36) +
    Math.random().toString(36).substring(2);

  const path = `videos/${name}-${id}.${videoType}`;
  const thumbnailPath = `thumbnails/${name}-${id}.png`;

  await Deno.writeFile(`./tmp/${id}.mp4`, new Uint8Array(await video.arrayBuffer()));

  const videoProcess = new Deno.Command("ffmpeg", {
    args: [
      "-i",
      `./tmp/${id}.mp4`,
      "-c:v",
      "libsvtav1",
      "-preset",
      "10",
      "-crf",
      "35",
      "-c:a",
      "copy",
      `./tmp/${id}.mp4`,
    ]
  }).spawn();

  const videoStatus = await videoProcess.status;
  if (videoStatus.code) throw new Error("Failed to convert video to AV1");

  const thumbnailProcess = new Deno.Command("ffmpeg", {
    args: [
      "-i",
      `${useSSL ? "https" : "http"}://${endPoint}:${port}/${bucket}/${path}`,
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

  const thumbnailStatus = await thumbnailProcess.status;
  if (thumbnailStatus.code) throw new Error("Failed to generate thumbnail");

  await minio.fPutObject(
    bucket,
    path,
    `./tmp/${id}.mp4`,
  );

  await minio.fPutObject(
    bucket,
    thumbnailPath,
    `./tmp/${id}.jpg`,
  );

  Deno.remove(`./tmp/${id}.mp4`);
  Deno.remove(`./tmp/${id}.jpg`);

  const videoKey = ["videos", video.name];
  const videoByUserKey = [
    "videos_by_user",
    user.id,
  ];

  const videoInfo: Video = {
    id,
    name,
    path,
    bucket,
    thumbnail: thumbnailPath,
    user,
    views: 0,
    likes: 0,
    dislikes: 0,
    comments: [],
  };

  const response = await kv.atomic().set(
    videoKey,
    videoInfo,
  ).set(
    videoByUserKey,
    videoInfo,
  ).commit();

  if (!response) {
    throw new Error("Failed to upload video info to database");
  }
}

export async function getAllVideos(): Promise<
  { video: Video; thumbnail: internal.Readable }[]
> {
  const videos: Deno.KvListIterator<Video> = kv.list({ prefix: ["videos"] });

  const result: { video: Video; thumbnail: internal.Readable }[] = [];

  for await (const { value } of videos) {
    if (!value) continue;

    result.push({
      video: value,
      thumbnail: await minio.getObject(bucket, value.thumbnail),
    });
  }

  return result;
}

export async function getVideoFile(
  path: string,
): Promise<internal.Readable | null> {
  return await minio.getObject(bucket, path);
}

async function createBucket() {
  await minio.makeBucket(
    bucket,
    Deno.env.get("MINIO_REGION"),
  );

  await minio.setBucketPolicy(
    bucket,
    `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "*"
                ]
            },
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::${bucket}/*"
            ]
        }
    ]
}`,
  );
}
