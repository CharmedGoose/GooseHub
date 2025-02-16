import { createDiscordOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";

const helpers = createHelpers(
  createDiscordOAuthConfig({
    redirectUri: `https://${Deno.env.get("DOMAIN_NAME") || "localhost:8000"}/callback`,
    scope: ["identify"],
  }),
);

export default helpers;
