// Tutorial: https://youtu.be/8jRuV9P5_gA

/// <reference lib="deno.unstable" />

const kv = await Deno.openKv();

export interface User {
  id: string;
  sessionId: string;
  username: string;
  avatar: string;
  email: string;
}

export async function createOrUpdateUser(user: User) {
  const userKeys = ["users", user.id];
  const userBySessionKeys = ["users_by_session", user.sessionId];

  const response = await kv.atomic()
    .set(userKeys, user)
    .set(userBySessionKeys, user)
		.commit();
	
	if (!response.ok) throw new Error("Failed to create or update user");
}

export async function deleteUserBySession(sessionId: string) {
	await kv.delete(["users_by_session", sessionId]);
}

export async function getUserBySession(sessionId: string): Promise<User | null> {
	const userBySessionKey = ["users_by_session", sessionId];
	const resp = await kv.get<User>(userBySessionKey);
	return resp.value;
}

export async function getUser(id: string): Promise<User | null> {
	const userKey = ["users", id];
	const resp = await kv.get<User>(userKey);
	return resp.value;
}