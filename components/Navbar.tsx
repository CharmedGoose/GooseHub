import { User } from "@utils/db.ts";

interface NavbarProps {
  user?: User;
  url: string;
}

export default function Navbar(props: NavbarProps) {
  return (
    <div>
      <div class="flex h-[20px] justify-center bg-secondary text-xs">
        <a href="https://discord.gg/3HZabHuYvH" target="_blank">
          <h1 class="text-accent">Discord</h1>
        </a>
      </div>
      <div class="navbar bg-base-100 base-content h-[70px]">
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
                class="w-full px-4 py-2 rounded-md border bg-secondary-content border-secondary-content text-base-content focus:border-primary focus:outline-none hover:border-primary"
              />
            </div>
          </div>

          <div class="navbar-end w-64 flex justify-end">
            <a role="button" href="/upload" class="btn btn-ghost m-1">
              Upload
            </a>
            {props.user
              ? (
                <>
                  <div class="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      class="btn btn-ghost btn-circle m-1"
                    >
                      <div className="avatar">
                        <div className="w-[38px] rounded-full">
                          <img
                            src={props.user.avatar}
                            alt="Avatar"
                          />
                        </div>
                      </div>
                    </div>
                    <ul
                      tabIndex={0}
                      class="dropdown-content menu bg-base-300 rounded-box z-[1] w-40 p-2 shadow"
                    >
                      <li>
                        <a href={`/settings`}>Settings</a>
                      </li>
                      <li>
                        <a href={`/signout?success_url=/`}>Sign Out</a>
                      </li>
                    </ul>
                  </div>
                </>
              )
              : (
                <a
                  href={`/signin?success_url=${props.url}`}
                  role="button"
                  class="btn btn-ghost m-1"
                >
                  Sign In
                </a>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
