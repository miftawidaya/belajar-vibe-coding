# Task: Pembuatan Unit Test Keseluruhan API

Dokumen ini berisi perencanaan implementasi pengujian otomatis (*unit test*) untuk semua endpoint API menggunakan `bun test`.

## Aturan & Ketentuan Umum
1. **Lokasi File:** Tempatkan seluruh berkas pengujian di dalam folder `tests` di *root directory*.
2. **Framework:** Gunakan modul standar bawaan Bun yaitu `bun:test` (`describe`, `it`, `expect`, `beforeEach`, dsb.).
3. **Isolasi Data (Penting):** Sebelum mengeksekusi masing-masing pengujian (*per skenario*), pastikan untuk selalu **menghapus data terkait** di database (seperti tabel `users` dan `sessions`) agar state pengujian selalu konsisten dan tidak saling mempengaruhi.

## Daftar Skenario Pengujian API

Berikut adalah skenario yang harus diuji untuk masing-masing API. Harap implementasikan pengujian berdasarkan poin-poin berikut tanpa harus terpaku pada langkah teknis yang kaku.

### 1. Register API (`POST /api/users`)
- [ ] **Sukses:** Mengirimkan data registrasi dengan format yang valid (`name`, `email`, `password` wajar) mengembalikan status sukses tanpa error.
- [ ] **Gagal (Email Duplikat):** Mencoba mendaftarkan user dengan `email` yang sudah ada di database ditolak secara sistem.
- [ ] **Gagal (Validasi Payload):** Mengirim field (seperti nama atau email) yang terlalu panjang (>255 karakter) atau format JSON tidak lengkap langsung ditolak.

### 2. Login API (`POST /api/users/login`)
- [ ] **Sukses:** Login menggunakan email dan password yang benar mengembalikan token UUID.
- [ ] **Gagal (Password Salah):** Login dengan email yang terdaftar namun password tidak cocok harus ditolak.
- [ ] **Gagal (User Tidak Ada):** Login dengan email yang sama sekali tidak ada di dalam database mengembalikan pesan kesalahan kredensial.
- [ ] **Gagal (Validasi Payload):** Payload login dengan field >255 karakter atau kosong harus ditolak.

### 3. Get Current User API (`POST /api/users/current`)
- [ ] **Sukses:** Meminta profil dengan melampirkan header `Authorization: Bearer <token_valid>` akan mengembalikan detail user terkait (nama, email, ID) tanpa *password*.
- [ ] **Gagal (Token Kosong):** Mengirim permintaan profil tanpa header *Authorization* akan diblokir dengan pesan "Unauthorized".
- [ ] **Gagal (Token Salah/Asal):** Menggunakan format token asal atau token yang tidak valid di database akan mengembalikan status "Unauthorized".

### 4. Logout API (`DELETE /api/users/logout`)
- [ ] **Sukses:** Mengirim token valid akan berhasil melogout user, dan token terhapus dari basis data (pastikan sesi tersebut benar-benar hilang).
- [ ] **Gagal (Token Kosong):** Mengakses endpoint tanpa header *Authorization* akan ditolak.
- [ ] **Gagal (Logout Berulang):** Mengirim request logout menggunakan token yang sudah kedaluwarsa atau sudah dilakukan logout sebelumnya harus mengembalikan error "Unauthorized".

---
*Instruksi untuk Implementator: Silakan tulis kode test untuk membuktikan skenario di atas dapat dipenuhi oleh sistem saat ini. Struktur *asserts* atau cara me-request server diserahkan kepada Anda.*
