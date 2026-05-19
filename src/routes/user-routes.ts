import { Elysia, t } from "elysia";
import { registerUser } from "../services/user-services";

/**
 * Route group for user-related endpoints.
 * Handles registering new users via POST /api/users.
 */
export const userRoutes = new Elysia().post(
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
);
