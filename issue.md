# Task: Implementasi Fitur Logout User (Backend)

Dokumen ini berisi panduan dan tahapan implementasi fitur logout pengguna. Silakan ikuti langkah-langkah di bawah ini secara berurutan.

## 1. Pembuatan Layer Service (Logika Bisnis)

**Target File:** `src/services/user-services.ts`

Di dalam file ini, buat sebuah fungsi baru (misalnya: `logoutUser(token: string)`). Tugas dari fungsi ini adalah:

1. **Penghapusan Sesi:** Gunakan Drizzle ORM untuk mengeksekusi perintah *delete* pada tabel `sessions` berdasarkan parameter `token` yang diberikan.
2. **Validasi Keberhasilan:** 
   - Anda perlu memastikan bahwa token tersebut benar-benar ada di tabel sebelum/saat dihapus (misalnya dengan mengecek *affected rows* hasil penghapusan, atau melakukan query *select* terlebih dahulu).
   - Jika token ternyata tidak ditemukan (tidak valid atau sudah kadaluarsa), lemparkan error dengan pesan `"Unauthorized"`.
3. **Return Value:** Jika penghapusan sukses, selesaikan eksekusi fungsi (bisa me-return `void`).

## 2. Pembuatan Layer Route (Endpoint API)

**Target File:** `src/routes/user-routes.ts`

Tambahkan routing baru pada instance ElysiaJS yang sudah ada.

- **Endpoint:** `DELETE /api/users/logout`
- **Header:** Endpoint ini mewajibkan adanya header `Authorization` dengan format `Bearer <token>`.
- **Tugas Eksekusi:**
  1. Ambil nilai header `Authorization` dari *context request* Elysia.
  2. Lakukan ekstraksi token (hilangkan string `"Bearer "`). Apabila format tidak sesuai atau tidak ada header, lemparkan pesan error `"Unauthorized"`.
  3. Panggil fungsi `logoutUser(token)` yang telah dibuat di layer Service.
  4. **Jika Sukses:** Kembalikan response JSON berupa:
     ```json
     {
       "data": "OK"
     }
     ```
  5. **Jika Gagal:** Tangkap *exception* yang dilemparkan, ubah HTTP Status Code menjadi 401 (Unauthorized), dan kembalikan JSON:
     ```json
     {
       "error": "Unauthorized"
     }
     ```

## Kriteria Penerimaan (Acceptance Criteria)

- Melakukan request `DELETE` ke `/api/users/logout` dengan melampirkan header `Authorization: Bearer <token_aktif>` mengembalikan respons `{"data": "OK"}` dan secara permanen menghapus token tersebut dari tabel `sessions`.
- Melakukan request tanpa header otorisasi atau dengan token palsu/sudah kedaluwarsa akan ditolak dengan respons HTTP `401` dan `{"error": "Unauthorized"}`.
- Penulisan kode mematuhi standar *TypeScript strict mode* (tidak ada `any`), dan mengisolasi logika *database/business logic* dari fungsi pengontrol (*routes*).
