import { createDiscordOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";

const helpers = createHelpers(
  createDiscordOAuthConfig({
    redirectUri: `https://${Deno.env.get("DOMAIN_NAME")}/callback`,
    scope: ["identify", "email"],
  }),
);

export default helpers;
