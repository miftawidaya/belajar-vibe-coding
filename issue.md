# Task: Implementasi Fitur Registrasi User (Backend)

Dokumen ini berisi panduan dan tahapan implementasi fitur registrasi user baru. Silakan ikuti langkah-langkah di bawah ini secara berurutan.

## 1. Pembuatan Skema Database

**Target File:** `src/db/schema.ts` (atau file skema utama Drizzle Anda)

Buatlah definisi tabel `users` menggunakan Drizzle ORM dengan spesifikasi berikut:

- `id`: integer, auto increment, primary key
- `name`: varchar(255), not null
- `email`: varchar(255), not null (tambahkan constraint unique karena email tidak boleh sama)
- `password`: varchar(255), not null
- `created_at`: timestamp, dengan nilai default `current_timestamp`

_Catatan:_ Setelah mendefinisikan skema, pastikan untuk menjalankan script push/generate dari Drizzle (misal `bun run db:push`) agar tabel benar-benar terbuat di MySQL.

## 2. Pembuatan Layer Service (Bisnis Logik)

**Target File:** Buat file baru di `src/services/user-services.ts`

Di dalam file ini, buat sebuah fungsi (misal: `registerUser(payload)`). Tugas dari fungsi ini adalah:

1. **Validasi Email:** Lakukan pencarian di database menggunakan Drizzle. Periksa apakah `email` yang diinputkan sudah ada di tabel `users`.
   - Jika email sudah ada, langsung lemparkan error/kembalikan pesan `"Email sudah terdaftar"`.
2. **Hash Password:** Lakukan proses hashing pada input password (bisa menggunakan bawaan `bun:password` atau library `bcrypt` standar). Ingat, _jangan pernah menyimpan password dalam bentuk plain text_.
3. **Simpan Data:** Masukkan data user baru (`name`, `email`, dan `password` yang sudah di-hash) ke dalam database menggunakan Drizzle.

## 3. Pembuatan Layer Route (Endpoint API)

**Target File:** Buat file baru di `src/routes/user-routes.ts`

Di dalam file ini, buat instance/grup routing ElysiaJS yang menangani endpoint registrasi.

- **Endpoint:** `POST /api/users`
- **Tugas:**
  1. Terima request body yang berisi `name`, `email`, dan `password`.
  2. Panggil fungsi `registerUser` dari layer Service.
  3. **Jika Sukses**, kembalikan response:
     ```json
     {
       "data": "OK"
     }
     ```
  4. **Jika Gagal (contoh email duplikat)**, tangkap errornya dan kembalikan response (sebaiknya dengan HTTP Status 400 Bad Request):
     ```json
     {
       "error": "Email sudah terdaftar"
     }
     ```

## 4. Registrasi Route di Entry Point

**Target File:** `src/index.ts` (Entry point utama aplikasi)

Langkah terakhir, import router yang telah Anda buat di `user-routes.ts` dan daftarkan (menggunakan `.use()`) ke dalam instance utama aplikasi ElysiaJS agar endpoint tersebut dapat diakses.

## Kriteria Penerimaan (Acceptance Criteria)

- Melakukan POST request dengan body yang benar akan berhasil menyimpan data dengan password ter-hash, dan mengembalikan `{"data": "OK"}`.
- Melakukan POST request dengan email yang sama untuk kedua kalinya akan ditolak dan mengembalikan `{"error": "Email sudah terdaftar"}`.
- Folder dan file baru dibuat sesuai instruksi (`src/services/user-services.ts` dan `src/routes/user-routes.ts`).
