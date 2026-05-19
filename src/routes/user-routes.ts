import { Elysia, t } from "elysia";
import { registerUser, loginUser, getCurrentUser } from "../services/user-services";

/**
 * Route group for user-related endpoints.
 * Handles registering new users, logging in, and retrieving active session profile.
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
        name: t.String(),
        email: t.String(),
        password: t.String(),
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
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/api/users/current",
    async ({ headers, set }) => {
      try {
        const authHeader = headers["authorization"];
        if (authHeader === undefined || authHeader.startsWith("Bearer ") === false) {
          throw new Error("Unauthorized");
        }

        const token = authHeader.substring(7);
        const user = await getCurrentUser(token);
        return { data: user };
      } catch (error) {
        set.status = 401;
        const message =
          error instanceof Error ? error.message : "Unauthorized";
        return { error: message };
      }
    }
  );


