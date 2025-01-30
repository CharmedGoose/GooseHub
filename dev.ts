#!/usr/bin/env -S deno run -A --watch=static/,routes/

import { load } from "$std/dotenv/mod.ts";
import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";

await load({ allowEmptyValues: true });
await dev(import.meta.url, "./main.ts", config);
