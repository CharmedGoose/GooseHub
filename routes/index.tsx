import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import Navbar from "../components/Navbar.tsx";

export default function Home(request: Request) {
  const count = useSignal(3);
  return (
    <div>
      <Navbar request={request} />
      <div class="px-4 py-8 mx-auto bg-[#86efac]">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <Counter count={count} />
        </div>
      </div>
    </div>
  );
}
