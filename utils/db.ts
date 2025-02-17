// Tutorial for User: https://youtu.be/8jRuV9P5_gA
/// <reference lib="deno.unstable" />

// @ts-types="minio/dist/esm/minio.d.mts"
import * as Minio from "minio";
import { Buffer } from "node:buffer";
import ShortUniqueId from "npm:short-unique-id@^5.2.0";
import { generateThumbnailFromVideo, getVideoDuration } from "@utils/ffmpeg.ts";

const { randomUUID } = new ShortUniqueId({ length: 10 });

const kv = await Deno.openKv(Deno.env.get("DENO_KV_PATH"));

const endPoint = Deno.env.get("S3_ENDPOINT") || "localhost";
const port = Number(Deno.env.get("S3_PORT"));
const useSSL = Boolean(Deno.env.get("S3_USE_SSL"));
const bucket = Deno.env.get("S3_BUCKET_NAME") || "my_bucket";
export const pathToDB = `${useSSL ? "https" : "http"}://${endPoint}:${port}`;

const minio = new Minio.Client({
  endPoint: endPoint,
  port: port,
  useSSL: useSSL,
  accessKey: Deno.env.get("S3_ACCESS_KEY"),
  secretKey: Deno.env.get("S3_SECRET_KEY"),
  region: Deno.env.get("S3_REGION"),
});

export interface User {
  id: string;
  sessionId: string;
  username: string;
  avatar: string;
  apiToken?: string;
}

export interface Video {
  id: string;
  name: string;
  path: string;
  thumbnail: string;
  bucket: string;
  user: string;
  description?: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  video: string;
  user: string;
  text: string;
  likes: number;
  dislikes: number;
  createdAt: number;
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

export async function uploadVideo(video: File, user: User): Promise<string> {
  if (video.type !== "video/mp4") {
    throw new Error("File type unsupported");
  }

  if (!(await minio.bucketExists(bucket))) {
    await createBucket();
  }

  const name = video.name.replace(/\.[^/.]+$/, "");
  const videoType = video.name.split(".").pop();
  const id = await createUniqueVideoId();

  const path = `videos/${id}.${videoType}`;
  const thumbnailPath = `thumbnails/${id}.webp`;

  const videoBuffer = Buffer.from(
    await video.arrayBuffer(),
  );

  await minio.putObject(
    bucket,
    path,
    videoBuffer,
    videoBuffer.byteLength,
  );

  const tmpPath = await generateThumbnailFromVideo(`${pathToDB}/${bucket}/${path}`);
  const duration = await getVideoDuration(video);

  await minio.fPutObject(
    bucket,
    thumbnailPath,
    tmpPath,
  ).catch(async (err) => {
    await Deno.remove(tmpPath);
    throw err;
  });

  Deno.remove(tmpPath);

  const videoKey = ["videos", id];
  const videoByNameKey = ["videos_by_name", video.name];
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
    user: user.id,
    duration: duration,
    views: 0,
    likes: 0,
    dislikes: 0,
    createdAt: new Date().toUTCString(),
    comments: [],
  };

  const response = await kv.atomic().set(
    videoKey,
    videoInfo,
  ).set(
    videoByNameKey,
    id,
  ).set(
    videoByUserKey,
    id,
  ).commit();

  if (!response.ok) {
    throw new Error("Failed to upload video info to database");
  }

  return id;
}

export async function updateThumbnail(video: Video, thumbnail: File) {
  const thumbnailPath = `thumbnails/${video.id}.${thumbnail.name.split(".").pop()}`;

  const thumbnailBuffer = Buffer.from(
    await thumbnail.arrayBuffer(),
  );

  await minio.removeObject(video.bucket, video.thumbnail);

  await minio.putObject(
    video.bucket,
    thumbnailPath,
    thumbnailBuffer,
    thumbnailBuffer.byteLength,
  );

  const videoKey = ["videos", video.id];

  video.thumbnail = thumbnailPath;

  await kv.delete(videoKey);

  const response = await kv.atomic().set(
    videoKey,
    video,
  ).commit();

  if (!response.ok) {
    throw new Error("Failed to upload video info to database");
  }
}

export async function updateVideo(video: Video) {
  const videoKey = ["videos", video.id];
  const videoByNameKey = ["videos_by_name", video.name];

  kv.delete(videoKey);
  kv.delete(videoByNameKey);

  const response = await kv.atomic().set(
    videoKey,
    video,
  ).set(
    videoByNameKey,
    video.id,
  ).commit();

  if (!response.ok) {
    throw new Error("Failed to upload video info to database");
  }
}

export async function getAllVideos(): Promise<
  { video: Video; thumbnail: string }[]
> {
  const videos: Deno.KvListIterator<Video> = kv.list({ prefix: ["videos"] });

  const result: { video: Video; thumbnail: string }[] = [];

  for await (const { value } of videos) {
    if (!value) continue;

    result.push({
      video: value,
      thumbnail: `${pathToDB}/${value.bucket}/${value.thumbnail}`,
    });
  }

  return result;
}

export async function getVideoById(id: string): Promise<Video | null> {
  const videoKey = ["videos", id];
  const resp = await kv.get<Video>(videoKey);
  return resp.value;
}

export async function incrementVideoViews(id: string) {
  const videoKey = ["videos", id];
  const resp = await kv.get<Video>(videoKey);

  if (!resp.value) return;

  resp.value.views++;
  await kv.set(videoKey, resp.value);
}

async function createBucket() {
  await minio.makeBucket(
    bucket,
    Deno.env.get("S3_REGION"),
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

async function createUniqueVideoId() {
  const id = randomUUID();
  if (await getVideoById(id)) {
    return createUniqueVideoId();
  }
  return id;
}
