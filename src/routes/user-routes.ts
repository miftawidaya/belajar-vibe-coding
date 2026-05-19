import { Elysia, t } from "elysia";
import { registerUser, loginUser, getCurrentUser, logoutUser } from "../services/user-services";

/**
 * Extracts the Bearer token from the Authorization header.
 *
 * @param authHeader The Authorization header value
 * @returns The extracted token string
 * @throws Error "Unauthorized" if the header is missing or format is invalid
 */
function extractBearerToken(authHeader: string | undefined): string {
  if (authHeader === undefined || authHeader.startsWith("Bearer ") === false) {
    throw new Error("Unauthorized");
  }
  return authHeader.substring(7);
}

/**
 * Route group for user-related endpoints.
 * Handles registering new users, logging in, retrieving active session profile, and logging out.
 */
export const userRoutes = new Elysia()
  .post(
    "/api/users",
    async ({ body, set }) => {
      try {
        await registerUser(body);
        return { data: "OK" };
      } catch (error) {
        set.status = 400;
        const message =
          error instanceof Error ? error.message : "Terjadi kesalahan internal";
        return { error: message };
      }
    },
    {
      body: t.Object({
        name: t.String({ maxLength: 255 }),
        email: t.String({ maxLength: 255 }),
        password: t.String({ maxLength: 255 }),
      }),
    }
  )
  .post(
    "/api/users/login",
    async ({ body, set }) => {
      try {
        const token = await loginUser(body);
        return { data: token };
      } catch (error) {
        set.status = 400;
        const message =
          error instanceof Error ? error.message : "Terjadi kesalahan internal";
        return { error: message };
      }
    },
    {
      body: t.Object({
        email: t.String({ maxLength: 255 }),
        password: t.String({ maxLength: 255 }),
      }),
    }
  )
  .post(
    "/api/users/current",
    async ({ headers, set }) => {
      try {
        const token = extractBearerToken(headers["authorization"]);
        const user = await getCurrentUser(token);
        return { data: user };
      } catch (error) {
        set.status = 401;
        const message =
          error instanceof Error ? error.message : "Unauthorized";
        return { error: message };
      }
    }
  )
  .delete(
    "/api/users/logout",
    async ({ headers, set }) => {
      try {
        const token = extractBearerToken(headers["authorization"]);
        await logoutUser(token);
        return { data: "OK" };
      } catch (error) {
        set.status = 401;
        const message =
          error instanceof Error ? error.message : "Unauthorized";
        return { error: message };
      }
    }
  );




