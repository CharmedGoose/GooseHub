# GooseHub (WIP)

A hub with gooses.

## Running Locally

1. Clone this repo:

    ```bash
    git clone https://github.com/CharmedGoose/GooseHub.git
    cd ./GooseGub
    ```

1. Fill in `.env.example`

1. Rename `.env.example` to `.env`

1. Set the MinIO bucket default policy for unauthenticated users to download:

    ```bash
    mc policy set download minio_alias/bucketname
    ```

1. Start the server:

    ```bash
    deno task start
    ```

1. Open `http://localhost:8000/` in your browser

## Note

I used Github Copilot for code completions.  
Also don't look at the source i don't know what i'm doing
