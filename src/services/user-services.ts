import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export type RegisterPayload = Readonly<{
  name: string;
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
