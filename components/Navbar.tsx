import { User } from "@utils/db.ts";

interface NavbarProps {
  user?: User;
  url: string;
}

export default function Navbar(props: NavbarProps) {
  return (
    <div class="navbar bg-zinc-800 text-white h-[70px]">
      <div class="max-w-7xl mx-auto px-4 w-full flex justify-between">
        <div class="navbar-start w-64">
          <a href="/" class="px-0">
            <img
              src="/icon.png"
              alt="GooseHub Logo"
              class="h-8 w-auto"
            />
          </a>
        </div>

        <div class="navbar-center flex-1 max-w-[17rem] px-4">
          <div className="form-control w-full">
            <input
              type="text"
              placeholder="Search GooseHub"
              class="w-full px-4 py-2 rounded-md border bg-zinc-700 text-white border-zinc-700 focus:border-orange-400 focus:outline-none"
            />
          </div>
        </div>

        <div class="navbar-end w-64 flex justify-end">
          {props.user
            ? (
              <>
                <a role="button" href="/upload" class="btn btn-ghost m-1">
                  Upload
                </a>
                <div class="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    class="btn btn-ghost btn-circle m-1"
                  >
                    <div className="avatar">
                      <div className="w-[38px] rounded-full">
                        <img
                          src={`https://cdn.discordapp.com/avatars/${props.user.id}/${props.user.avatar}.png`}
                          alt="Avatar"
                        />
                      </div>
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    class="dropdown-content menu bg-zinc-900 rounded-box z-[1] w-40 p-2 shadow"
                  >
                    <li>
                      <a href={`/signout?success_url=/`}>Sign Out</a>
                    </li>
                  </ul>
                </div>
              </>
            )
            : (
              <a href={`/signin?success_url=${props.url}`} role="button" class="btn btn-ghost m-1">
                Sign In
              </a>
            )}
        </div>
      </div>
    </div>
  );
}
