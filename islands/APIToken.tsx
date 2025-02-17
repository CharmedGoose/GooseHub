import { useSignal } from "@preact/signals";
import { User } from "@utils/db.ts";

interface APITokenProps {
  user: User;
}

export default function APITOKEN(props: APITokenProps) {
  const token = useSignal<string | undefined>(undefined);
  const generateToken = async () => {
    token.value = (await fetch(`/settings/api`, { method: "POST" })).headers.get("apiKey") || "";
  };

  return (
    <>
      <p class="pb-6">{token.value}</p>
      {props.user.apiToken || token.value
        ? (
          <button class="btn btn-primary" onClick={generateToken}>
            Reset your API token
          </button>
        )
        : (
          <button class="btn btn-primary" onClick={generateToken}>
            Get an API token
          </button>
        )}
    </>
  );
}
