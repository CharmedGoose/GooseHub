import "$std/dotenv/load.ts";
// @deno-types="minio/dist/esm/minio.d.mts"
import * as Minio from "minio";

const kv = await Deno.openKv(Deno.env.get("DENO_KV_PATH"));

const minio = new Minio.Client({
  endPoint: Deno.env.get("S3_ENDPOINT") || "localhost",
  port: Number(Deno.env.get("S3_PORT")),
  useSSL: Boolean(Deno.env.get("S3_USE_SSL")),
  accessKey: Deno.env.get("S3_ACCESS_KEY"),
  secretKey: Deno.env.get("S3_SECRET_KEY"),
});

const bucket = Deno.env.get("S3_BUCKET_NAME") || "my_bucket";

console.log("Clearing KV");

for await (const { key } of kv.list({ prefix: [] })) {
  await kv.delete(key);
}

console.log("KV cleared");
console.log("Clearing MinIO bucket");

const objects = minio.listObjects(bucket, "", true);
await objects.forEach(async (obj) => {
  await minio.removeObject(
    bucket,
    obj.name,
  );
});

console.log("MinIO bucket cleared");
console.log("All databases cleared");
