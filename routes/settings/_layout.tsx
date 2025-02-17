import { PageProps } from "$fresh/server.ts";

export default function Layout({ Component, url }: PageProps) {
  const currentURL = url.pathname;
  return (
    <div class="layout min-h-[calc(100vh-90px)] flex justify-center">
      <div class="max-w-7xl w-full flex gap-4 p-4">
        <div class="w-56">
          <ul class="menu bg-base-200 rounded-box w-full sticky top-4">
            <li>
              <a href="/settings" class={currentURL=="/settings" ? "active" : undefined}>Account</a>
            </li>
            <li>
              <a href="/settings/api" class={currentURL=="/settings/api" ? "active" : undefined}>API Token</a>
            </li>
          </ul>
        </div>
        <div className="divider divider-horizontal divider-primary" />
        <div class="flex-1">
          <Component />
        </div>
      </div>
    </div>
  );
}
