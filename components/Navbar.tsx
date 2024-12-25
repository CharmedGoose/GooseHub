export default function Navbar() {
  return (
    <div>
      <nav class="items-center px-16 py-4 bg-zinc-800 text-white">
        <div class="flex items-center justify-between mx-auto">
          <a href="/">
            <img
              src="/GooseHubTrimmed.png"
              alt="GooseHub"
            />
          </a>
          <a href="/about">Sign In</a>
        </div>
      </nav>
    </div>
  );
}
