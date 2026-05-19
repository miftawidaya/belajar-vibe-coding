import { db } from "../db/db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";

export type RegisterPayload = Readonly<{
  name: string;
  email: string;
  password: string;
}>;

export type LoginPayload = Readonly<{
  email: string;
  password: string;
}>;

/**
 * Registers a new user in the database.
 * Validates that the email is not already registered, hashes the password
 * securely using Bun's built-in bcrypt implementation, and stores the user.
 *
 * @param payload The registration request payload
 * @throws Error if the email is already registered
 */
export async function registerUser(payload: RegisterPayload): Promise<void> {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await Bun.password.hash(payload.password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  await db.insert(users).values({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
  });
}

/**
 * Logs in a user by verifying their email and password.
 * If successful, generates a UUID session token, records it in the database,
 * and returns the generated token.
 *
 * @param payload The login request credentials
 * @returns The session token as a string
 * @throws Error if email is not found or password verification fails
 */
export async function loginUser(payload: LoginPayload): Promise<string> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email))
    .limit(1);

  if (user === undefined) {
    throw new Error("Email atau password salah");
  }

  const isPasswordValid = await Bun.password.verify(
    payload.password,
    user.password
  );

  if (isPasswordValid === false) {
    throw new Error("Email atau password salah");
  }

  const token = crypto.randomUUID();

  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  return token;
}

export type UserProfile = Readonly<{
  id: number;
  name: string;
  email: string;
  createdAt: Date | null;
}>;

/**
 * Retrieves the currently logged-in user profile based on the session token.
 * Validates the session token in the database and returns the associated user's details.
 *
 * @param token The session token from the Authorization header
 * @returns The user profile details (id, name, email, createdAt)
 * @throws Error "Unauthorized" if the token is invalid or session is not found
 */
export async function getCurrentUser(token: string): Promise<UserProfile> {
  const [result] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);

  if (result === undefined) {
    throw new Error("Unauthorized");
  }

  return result;
}

/**
 * Logs out a user by deleting their active session token from the database.
 *
 * @param token The session token from the Authorization header
 * @throws Error "Unauthorized" if the token is not found or already deleted
 */
export async function logoutUser(token: string): Promise<void> {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  if (session === undefined) {
    throw new Error("Unauthorized");
  }

  await db.delete(sessions).where(eq(sessions.token, token));
}



