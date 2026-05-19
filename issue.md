# Task: Implementasi Fitur Get Current User (Backend)

Dokumen ini berisi panduan dan tahapan implementasi fitur untuk mengambil data user yang sedang login saat ini berdasarkan token sesi. Silakan ikuti langkah-langkah di bawah ini secara berurutan.

## 1. Pembuatan Layer Service (Logika Bisnis)

**Target File:** `src/services/user-services.ts`

Di dalam file ini, buat sebuah fungsi baru (misalnya: `getCurrentUser(token: string)`). Tugas dari fungsi ini adalah:

1. **Validasi Token di Database:** Lakukan pencarian (query) ke database menggunakan Drizzle pada tabel `sessions` (atau sesuai referensi relasi yang ada) berdasarkan `token` yang diberikan.
2. **Pengambilan Data Profil User:** Lakukan *join* antara tabel `sessions` dengan tabel `users` (berdasarkan `user_id`), atau ambil data user secara berurutan untuk mendapatkan data diri pemilik sesi tersebut.
   - *Penting:* Jangan pernah mengembalikan (me-return) field `password` ke luar.
3. **Validasi Kegagalan:** Jika token tidak valid, kadaluarsa, atau tidak ditemukan di tabel sesi/user, lemparkan error dengan pesan `"Unauthorized"`.
4. **Return Value:** Jika validasi sukses, fungsi harus mengembalikan objek yang berisi data profil user (`id`, `name`, `email`, `createdAt`).

## 2. Pembuatan Layer Route (Endpoint API)

**Target File:** `src/routes/user-routes.ts`

Tambahkan routing baru pada instance ElysiaJS yang sudah ada.

- **Endpoint:** `POST /api/users/current`
- **Header:** Wajib menyertakan header `Authorization` dengan format `Bearer <token>`.
- **Tugas Eksekusi:**
  1. Ambil nilai header `Authorization` dari request yang masuk di Elysia.
  2. Ekstrak string `<token>` (buang kata "Bearer "). Jika token kosong/tidak ada, lemparkan error "Unauthorized".
  3. Panggil fungsi `getCurrentUser(token)` dari layer Service.
  4. **Jika Sukses:** Kembalikan response JSON berupa:
     ```json
     {
       "data": {
         "id": 1,
         "name": "mifta",
         "email": "mifta@localhost",
         "created_at": "2026-05-19T00:00:00.000Z"
       }
     }
     ```
  5. **Jika Gagal:** Tangkap error, atur HTTP Status Code menjadi 401 (Unauthorized), dan kembalikan response:
     ```json
     {
       "error": "Unauthorized"
     }
     ```

## Kriteria Penerimaan (Acceptance Criteria)

- Melakukan request POST ke `/api/users/current` dengan melampirkan header `Authorization: Bearer <token_aktif>` mengembalikan profil user secara utuh kecuali password.
- Melakukan request POST tanpa header `Authorization` atau token yang tidak valid/salah akan ditolak dan mengembalikan struktur `{"error": "Unauthorized"}`.
- Implementasi harus menggunakan TypeScript strict mode (tidak memperbolehkan `any`), memisahkan alur logika di `services`, dan memisahkan pengontrol *request/response* di layer `routes`.
