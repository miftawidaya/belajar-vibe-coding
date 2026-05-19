import { describe, it, expect, beforeEach } from "bun:test";
import { app } from "../src/index";
import { db } from "../src/db/db";
import { users, sessions } from "../src/db/schema";

type ValidationResponse = Readonly<{
  type: string;
  message: string;
}>;

type TokenResponse = Readonly<{
  data: string;
}>;

type UserProfileResponse = Readonly<{
  data: Readonly<{
    id: number;
    name: string;
    email: string;
    password?: string;
  }>;
}>;

describe("API Unit Tests", () => {
  // Clear the database before each test scenario to ensure clean and isolated state
  beforeEach(async () => {
    try {
      await db.delete(sessions);
      await db.delete(users);
    } catch (error) {
      console.error("Gagal membersihkan database sebelum test:", error);
    }
  });

  describe("Register API - POST /api/users", () => {
    it("harus sukses mendaftarkan pengguna baru dengan data valid", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Mifta",
            email: "mifta@localhost",
            password: "rahasia",
          }),
        })
      );

      expect(response.status).toBe(200);
      const body = await response.json() as Readonly<{ data: string }>;
      expect(body).toEqual({ data: "OK" });
    });

    it("harus gagal jika email sudah terdaftar", async () => {
      // Daftarkan user pertama
      await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Mifta",
            email: "mifta@localhost",
            password: "rahasia",
          }),
        })
      );

      // Coba daftarkan kembali dengan email yang sama
      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Mifta Duplikat",
            email: "mifta@localhost",
            password: "passwordbaru",
          }),
        })
      );

      expect(response.status).toBe(400);
      const body = await response.json() as Readonly<{ error: string }>;
      expect(body).toEqual({ error: "Email sudah terdaftar" });
    });

    it("harus gagal jika panjang input melebihi 255 karakter", async () => {
      const longName = "A".repeat(300);
      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: longName,
            email: "valid@localhost",
            password: "rahasia",
          }),
        })
      );

      // Elysia mengembalikan 422 untuk kesalahan validasi skema
      expect(response.status).toBe(422);
      const body = await response.json() as ValidationResponse;
      expect(body.type).toBe("validation");
      expect(body.message).toContain("Expected string length less or equal to 255");
    });
  });

  describe("Login API - POST /api/users/login", () => {
    beforeEach(async () => {
      // Daftarkan satu user default untuk pengujian login
      await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Mifta",
            email: "mifta@localhost",
            password: "rahasia",
          }),
        })
      );
    });

    it("harus sukses login dengan email dan password yang benar", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "mifta@localhost",
            password: "rahasia",
          }),
        })
      );

      expect(response.status).toBe(200);
      const body = await response.json() as TokenResponse;
      expect(body.data).toBeDefined();
      expect(typeof body.data).toBe("string"); // Token UUID
    });

    it("harus gagal jika password salah", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "mifta@localhost",
            password: "password_salah",
          }),
        })
      );

      expect(response.status).toBe(400);
      const body = await response.json() as Readonly<{ error: string }>;
      expect(body).toEqual({ error: "Email atau password salah" });
    });

    it("harus gagal jika email tidak terdaftar", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "tidak_terdaftar@localhost",
            password: "rahasia",
          }),
        })
      );

      expect(response.status).toBe(400);
      const body = await response.json() as Readonly<{ error: string }>;
      expect(body).toEqual({ error: "Email atau password salah" });
    });

    it("harus gagal jika payload login melebihi batas 255 karakter", async () => {
      const longEmail = "a".repeat(250) + "@localhost";
      const response = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: longEmail,
            password: "rahasia",
          }),
        })
      );

      expect(response.status).toBe(422);
      const body = await response.json() as ValidationResponse;
      expect(body.type).toBe("validation");
    });
  });

  describe("Get Current User API - POST /api/users/current", () => {
    let token: string;

    beforeEach(async () => {
      // Registrasi
      await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Mifta",
            email: "mifta@localhost",
            password: "rahasia",
          }),
        })
      );

      // Login untuk mengambil token valid
      const loginResponse = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "mifta@localhost",
            password: "rahasia",
          }),
        })
      );
      const loginBody = await loginResponse.json() as TokenResponse;
      token = loginBody.data;
    });

    it("harus sukses mengembalikan profil jika token valid", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/current", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })
      );

      expect(response.status).toBe(200);
      const body = await response.json() as UserProfileResponse;
      expect(body.data.id).toBeDefined();
      expect(body.data.name).toBe("Mifta");
      expect(body.data.email).toBe("mifta@localhost");
      expect(body.data.password).toBeUndefined(); // Password tidak boleh bocor
    });

    it("harus gagal jika header Authorization tidak dilampirkan", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/current", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );

      expect(response.status).toBe(401);
      const body = await response.json() as Readonly<{ error: string }>;
      expect(body).toEqual({ error: "Unauthorized" });
    });

    it("harus gagal jika token salah / tidak valid", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/current", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer token_salah",
          },
        })
      );

      expect(response.status).toBe(401);
      const body = await response.json() as Readonly<{ error: string }>;
      expect(body).toEqual({ error: "Unauthorized" });
    });
  });

  describe("Logout API - DELETE /api/users/logout", () => {
    let token: string;

    beforeEach(async () => {
      // Registrasi
      await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Mifta",
            email: "mifta@localhost",
            password: "rahasia",
          }),
        })
      );

      // Login
      const loginResponse = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "mifta@localhost",
            password: "rahasia",
          }),
        })
      );
      const loginBody = await loginResponse.json() as TokenResponse;
      token = loginBody.data;
    });

    it("harus sukses logout dengan token valid dan menolak request berikutnya", async () => {
      // Logout pertama kali
      const logoutResponse = await app.handle(
        new Request("http://localhost/api/users/logout", {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
      );

      expect(logoutResponse.status).toBe(200);
      const logoutBody = await logoutResponse.json() as Readonly<{ data: string }>;
      expect(logoutBody).toEqual({ data: "OK" });

      // Request get profile berikutnya harus gagal karena session sudah dihapus
      const currentResponse = await app.handle(
        new Request("http://localhost/api/users/current", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
      );

      expect(currentResponse.status).toBe(401);
      const currentBody = await currentResponse.json() as Readonly<{ error: string }>;
      expect(currentBody).toEqual({ error: "Unauthorized" });
    });

    it("harus gagal jika logout tanpa menyertakan token", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/logout", {
          method: "DELETE",
        })
      );

      expect(response.status).toBe(401);
      const body = await response.json() as Readonly<{ error: string }>;
      expect(body).toEqual({ error: "Unauthorized" });
    });

    it("harus gagal jika token salah atau sudah pernah dilogout sebelumnya", async () => {
      // Logout pertama sukses
      await app.handle(
        new Request("http://localhost/api/users/logout", {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
      );

      // Coba logout lagi dengan token yang sama
      const response = await app.handle(
        new Request("http://localhost/api/users/logout", {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
      );

      expect(response.status).toBe(401);
      const body = await response.json() as Readonly<{ error: string }>;
      expect(body).toEqual({ error: "Unauthorized" });
    });
  });
});

