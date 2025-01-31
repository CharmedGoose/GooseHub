import { useSignal } from "@preact/signals";
import { UploadProps } from "../routes/upload.tsx";

export default function UploadVideo(props: UploadProps) {
  const { message } = props;
  const isUploading = useSignal(false);

  return (
        <>
          <div class="card bg-secondary w-96">
            <div class="card-body items-center text-center">
              <h2 class="card-title mb-3">Upload Video</h2>
              {message ? <p class="text-error mb-3">{message}</p> : null}
              <form
                method="post"
                encType="multipart/form-data"
                class="space-y-4"
                onSubmit={() => isUploading.value = true}
              >
                <input
                  type="file"
                  name="video-file"
                  accept=".mp4"
                  class="file-input file-input-bordered file-input-info w-full max-w-xs text-base-content hover:border-primary"
                />
                <div class="card-actions justify-end">
                  <button class="btn w-full" disabled={isUploading.value}>
                    {isUploading.value
                      ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Uploading...
                        </>
                      )
                      : "Upload!"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
  );
}
