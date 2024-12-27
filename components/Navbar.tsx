import helpers from "../utils/oauth.ts";

export interface NavbarProps {
  request: Request;
}
export default function Navbar(props: NavbarProps) {
  return (
    <div>
      <nav class="flex items-center px-8 py-4 bg-zinc-800 text-white">
        <div class="flex items-center justify-between mx-auto w-full max-w-screen-xl">
          <a href="/">
            <img
              src="/icon.png"
              alt="GooseHub Logo"
              class="h-8 w-auto"
            />
          </a>
          <div class="flex-grow mx-4 max-w-xs">
            <input
              type="text"
              placeholder="Search GooseHub"
              class="w-3/4 px-4 py-2 rounded-md border bg-zinc-700 text-white border-zinc-700 focus:border-orange-400 focus:outline-none"
            />
          </div>
          {helpers.getSessionId(props.request) == undefined
            ? <a href="/signin">Login</a>
            : <a href="/signout">Logout</a>}
        </div>
      </nav>
    </div>
  );
}
