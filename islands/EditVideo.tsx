import { Signal, useSignal } from "@preact/signals";
import { Video } from "@utils/db.ts";

const steps = ["Choose A Thumbnail", "Choose A Title", "Set A Description"];

interface EditProps {
  video: Video;
  isUpload: boolean;
}

export default function EditVideo(props: EditProps) {
  const { video, isUpload } = props;
  const currentStep = useSignal(0);
  const thumbnail = useSignal<File | null>(null);
  const title = useSignal(video?.name || "Title");
  const description = useSignal("");

  const updateVideo = async (event: Event) => {
    event.preventDefault();

    const form = new FormData();
    if (thumbnail.value) form.append("thumbnail", thumbnail.value);
    form.append("title", title.value);
    form.append("description", description.value);

    await fetch(`/edit?v=${video.id}`, { method: "POST", body: form });

    setTimeout(() => {
      globalThis.location.href = `/watch?v=${video.id}`;
    }, 1000)
  };

  return (
    <main class="flex flex-row h-[calc(100vh-90px)] justify-center items-center">
      <div class="card bg-zinc-900 w-96">
        <div class="card-body items-center text-center">
          <h2 class="card-title">
            {isUpload ? "Upload Video" : "Edit Video"}
          </h2>
          <p class="mb-3">{steps[currentStep.value]}</p>
          <form
            method="post"
            encType="multipart/form-data"
            class="space-y-4 w-full max-w-xs"
            onSubmit={updateVideo}
          >
            {currentStep.value === 0 // i don't know a better way
              ? (
                <UploadThumbnail
                  currentStep={currentStep}
                  thumbnail={thumbnail}
                />
              )
              : currentStep.value === 1
              ? (
                <SetTitle
                  currentStep={currentStep}
                  title={title}
                />
              )
              : currentStep.value === 2
              ? (
                <SetDescription
                  currentStep={currentStep}
                  description={description}
                />
              )
              : currentStep.value = 0}
          </form>
        </div>
      </div>
    </main>
  );
}

function UploadThumbnail(
  props: {
    currentStep: Signal<number>;
    thumbnail: Signal<File | null>;
    isHidden?: boolean;
  },
) {
  return (
    <>
      <input
        type="file"
        id="thumbnail-file"
        accept=".png,.jpg,.jpeg"
        onInput={(element) =>
          props.thumbnail.value =
            (element.target as HTMLInputElement).files?.[0] ||
            null}
        class="file-input file-input-bordered w-full max-w-xs bg-zinc-700 text-white hover:border-orange-400"
      />
      <div class="card-actions justify-between">
        <button
          class="btn justify-end"
          type="button"
          onClick={() => {
            const input = document.getElementById(
              "thumbnail-file",
            ) as HTMLInputElement;
            if (input) input.value = "";
            props.thumbnail.value = null;
          }}
        >
          Reset
        </button>
        <button
          class="btn btn-primary justify-start"
          type="button"
          onClick={() => props.currentStep.value++}
        >
          Next!
        </button>
      </div>
    </>
  );
}

function SetTitle(
  props: {
    currentStep: Signal<number>;
    title: Signal<string>;
    isHidden?: boolean;
  },
) {
  return (
    <>
      <input
        type="text"
        value={props.title.value}
        onInput={(element) =>
          props.title.value = (element.target as HTMLInputElement).value}
        class="input input-bordered w-full max-w-xs bg-zinc-700 text-white hover:border-orange-400"
      />
      <div class="card-actions justify-between">
        <button
          class="btn justify-end"
          type="button"
          onClick={() => props.currentStep.value--}
        >
          Back
        </button>
        <button
          class="btn btn-primary justify-start"
          type="button"
          onClick={() => props.currentStep.value++}
        >
          Next!
        </button>
      </div>
    </>
  );
}

function SetDescription(
  props: {
    currentStep: Signal<number>;
    description: Signal<string>;
    isHidden?: boolean;
  },
) {
  return (
    <>
      <textarea
        value={props.description.value}
        onInput={(element) =>
          props.description.value = (element.target as HTMLInputElement).value}
        class="textarea textarea-bordered w-full max-w-xs resize-none bg-zinc-700 text-white hover:border-orange-400"
      />
      <div class="card-actions justify-between">
        <button
          class="btn justify-end"
          type="button"
          onClick={() => props.currentStep.value--}
        >
          Back
        </button>
        <button
          class="btn btn-primary justify-start"
          type="submit"
        >
          Finish!
        </button>
      </div>
    </>
  );
}
