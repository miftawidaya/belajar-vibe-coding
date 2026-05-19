# Task: Implementasi Fitur Login User (Backend)

Dokumen ini berisi panduan dan tahapan implementasi fitur login user. Silakan ikuti langkah-langkah di bawah ini secara berurutan.

## 1. Pembuatan Skema Database (Tabel Sessions)

**Target File:** `src/db/schema.ts`

Tambahkan definisi tabel `sessions` menggunakan Drizzle ORM dengan spesifikasi berikut:

- `id`: integer, auto increment, primary key
- `token`: varchar(255), not null (akan diisi dengan UUID untuk representasi sesi login user)
- `user_id`: integer (sebagai referensi/Foreign Key ke tabel `users`)
- `created_at`: timestamp, dengan nilai default `current_timestamp`

*Catatan:* Setelah mendefinisikan skema, pastikan untuk menjalankan perintah sinkronisasi database dari Drizzle (misalnya `bun run db:push`) agar tabel benar-benar dibuat di dalam database MySQL.

## 2. Pembuatan Layer Service (Logika Bisnis)

**Target File:** `src/services/user-services.ts`

Di dalam file ini, buat sebuah fungsi baru (misalnya: `loginUser(payload)`). Tugas dari fungsi ini adalah:

1. **Pencarian Data User:** Lakukan pencarian di database menggunakan Drizzle pada tabel `users` berdasarkan `email` yang diberikan di payload.
2. **Validasi Kredensial:**
   - Jika user dengan email tersebut tidak ditemukan, langsung lemparkan error dengan pesan `"Email atau password salah"`.
   - Jika user ditemukan, lakukan verifikasi password menggunakan fungsi bawaan `Bun.password.verify` (atau utilitas `bcrypt` yang sesuai) untuk membandingkan password dari request dengan password hash di database.
   - Jika password tidak cocok, lemparkan error dengan pesan `"Email atau password salah"`.
3. **Pembuatan Token (UUID):** Generate string UUID acak yang unik (bisa menggunakan `crypto.randomUUID()`).
4. **Penyimpanan Sesi:** Masukkan record baru ke tabel `sessions` yang berisi `token` yang baru dibuat dan `user_id` milik user yang berhasil login.
5. **Return Value:** Fungsi harus mengembalikan token UUID tersebut.

## 3. Pembuatan Layer Route (Endpoint API)

**Target File:** `src/routes/user-routes.ts`

Tambahkan routing baru pada instance ElysiaJS yang sudah ada untuk menangani proses login.

- **Endpoint:** `POST /api/users/login`
- **Request Body Validation:** Validasi body request agar wajib memiliki `email` (string) dan `password` (string).
- **Tugas Eksekusi:**
  1. Panggil fungsi `loginUser` dari layer Service menggunakan data body.
  2. **Jika Sukses:** Kembalikan response JSON berisi token:
     ```json
     {
       "data": "<token_uuid_disini>"
     }
     ```
  3. **Jika Gagal:** Tangkap exception/error yang dilemparkan oleh service, ubah HTTP Status Code menjadi 400 atau 401, dan kembalikan response:
     ```json
     {
       "error": "Email atau password salah"
     }
     ```

## Kriteria Penerimaan (Acceptance Criteria)

- Request POST ke `/api/users/login` dengan akun terdaftar mengembalikan token UUID, dan data token beserta `user_id` tersimpan di tabel `sessions`.
- Request dengan email yang tidak terdaftar, atau password yang salah mengembalikan JSON `{"error": "Email atau password salah"}`.
- Menggunakan TypeScript dengan strict mode (tanpa `any`), dan mengisolasi rute (`routes`) dari logika bisnis (`services`) secara teratur.
