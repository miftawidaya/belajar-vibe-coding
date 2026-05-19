import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    host: "127.0.0.1",
    port: 3306,
    user: "miftawidaya",
    password: "password",
    database: "belajar_vibe_coding",
  },
});





