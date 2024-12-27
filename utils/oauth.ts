import { createHelpers, createDiscordOAuthConfig } from "jsr:@deno/kv-oauth";

const helpers = createHelpers(
    createDiscordOAuthConfig({ redirectUri: "https://studious-train-qxwv7gjvvvj29579-8000.app.github.dev/callback", scope: "identify" })
);

export default helpers;