const kv = Deno.openKv()

export interface User {
    id: number
    username: string
    email: string
}