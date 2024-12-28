import { User } from "../utils/db.ts";

interface NavbarProps {
  user?: User;
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
          {props.user
            ? (
              <a href="/signout">
                <img
                  src={`https://cdn.discordapp.com/avatars/${props.user.id}/${props.user.avatar}.png`}
                  class="h-10 w-auto rounded-full"
                />
              </a>
            )
            : <a href="/login">Login</a>}
        </div>
      </nav>
    </div>
  );
}
