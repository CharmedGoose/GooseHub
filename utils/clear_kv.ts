const kv = await Deno.openKv();

for await (const { key } of kv.list({ prefix: [] })) {
  await kv.delete(key);
}