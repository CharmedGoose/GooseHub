import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
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
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <img
                      src={`https://cdn.discordapp.com/avatars/${props.user.id}/${props.user.avatar}.png`}
                      class="h-10 w-auto rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Account settings
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        Support
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                      >
                        License
                      </a>
                    </MenuItem>
                    <form action="#" method="POST">
                      <MenuItem>
                        <button
                          type="submit"
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        >
                          Sign out
                        </button>
                      </MenuItem>
                    </form>
                  </div>
                </MenuItems>
              </Menu>
            )
            : <a href="/login">Login</a>}
        </div>
      </nav>
    </div>
  );
}
