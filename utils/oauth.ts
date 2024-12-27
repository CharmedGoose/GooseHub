import { createHelpers, createDiscordOAuthConfig } from "jsr:@deno/kv-oauth";

const helpers = createHelpers(
    createDiscordOAuthConfig({ redirectUri: `https://${Deno.env.get("DOMAIN_NAME")}/callback`, scope: "identify" })
);

export default helpers;