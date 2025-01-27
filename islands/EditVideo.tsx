import { useSignal } from "@preact/signals";
import { Video } from "@utils/db.ts";

interface Props {
  video: Video;
  error?: string;
}

export default function EditVideo(props: Props) {
  const { video, error } = props;
  const step = useSignal(0);

  return (
    <>
      <div class="card bg-zinc-900 w-96">
        <div class="card-body items-center text-center">
          <h2 class="card-title mb-3">Edit Video</h2>
          {error ? <p class="text-red-600 mb-3">{error}</p> : null}
          <form
            method="post"
            encType="multipart/form-data"
            class="space-y-4"
            onSubmit={() => step.value++}
          >
            <input
              type="file"
              name="thumbnail-file"
              accept=".png,.jpg,.jpeg"
              class="file-input file-input-bordered w-full max-w-xs bg-zinc-700 text-white hover:border-orange-400"
            />
            <div class="card-actions justify-end">
              <button class="btn w-full">
                "Next"
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
