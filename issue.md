# Bug: Registrasi User Tidak Memvalidasi Panjang Input dan Mengekspos Detail Error Internal

## Deskripsi Bug

Saat melakukan registrasi user baru melalui endpoint `POST /api/users` dengan field `name` yang melebihi 255 karakter (batas kolom `varchar(255)` di database), aplikasi mengembalikan respons `400 Bad Request` tetapi dengan pesan error yang mengandung:

- Query SQL lengkap (`insert into users ...`)
- Seluruh parameter input termasuk **hash password** (`$2b$10$...`)

Ini merupakan kerentanan keamanan karena mengekspos struktur database dan data sensitif kepada pengguna akhir.

## Langkah Reproduksi

1. Jalankan aplikasi (`bun run src/index.ts`).
2. Kirim request berikut:
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "A<diulang 300 kali>", "email": "test@localhost", "password": "rahasia"}'
   ```
3. Perhatikan respons error yang mengekspos query SQL dan hash password.

## Akar Masalah

1. **Tidak ada validasi panjang input di layer route.** Validasi body request Elysia hanya memeriksa tipe data (`t.String()`), tetapi tidak membatasi panjang maksimum karakter.
2. **Error dari database diteruskan mentah ke klien.** Pada `catch` block di route handler, `error.message` dari Drizzle/MySQL langsung dikembalikan tanpa disaring.

## Tahapan Perbaikan

### 1. Tambahkan Validasi Panjang Input di Layer Route

**Target File:** `src/routes/user-routes.ts`

Pada endpoint `POST /api/users`, ubah skema validasi body request agar membatasi panjang maksimum setiap field string. Gunakan opsi `maxLength` dari Elysia `t.String()`.

Contoh perubahan:
```typescript
body: t.Object({
  name: t.String({ maxLength: 255 }),
  email: t.String({ maxLength: 255 }),
  password: t.String({ maxLength: 255 }),
})
```

Lakukan hal yang sama untuk endpoint `POST /api/users/login`:
```typescript
body: t.Object({
  email: t.String({ maxLength: 255 }),
  password: t.String({ maxLength: 255 }),
})
```

### 2. Perbaiki Error Handling agar Tidak Mengekspos Detail Internal

**Target File:** `src/services/user-services.ts`

Pada fungsi `registerUser`, bungkus operasi `db.insert(...)` dengan `try...catch` terpisah. Jika terjadi error dari database (misalnya karena constraint violation atau alasan lain yang tidak terduga), tangkap error tersebut dan lemparkan kembali dengan pesan generik yang aman, bukan pesan asli dari database.

Contoh:
```typescript
try {
  await db.insert(users).values({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
  });
} catch {
  throw new Error("Terjadi kesalahan internal");
}
```

Terapkan pola yang sama pada fungsi `loginUser` untuk operasi `db.insert(sessions)` dan fungsi-fungsi service lainnya yang melakukan operasi database.

## Kriteria Penerimaan (Acceptance Criteria)

- Registrasi dengan field `name`, `email`, atau `password` yang melebihi 255 karakter langsung ditolak oleh validasi Elysia **sebelum** menyentuh database, dengan pesan error validasi standar (bukan query SQL).
- Jika terjadi error tak terduga dari database, respons yang dikembalikan ke klien berisi pesan generik `"Terjadi kesalahan internal"`, **bukan** detail query SQL atau data sensitif.
- Semua endpoint yang menerima input string (`POST /api/users`, `POST /api/users/login`) harus memiliki batasan `maxLength` yang sesuai.
- Kode tetap mematuhi standar TypeScript strict mode (tanpa `any`).
