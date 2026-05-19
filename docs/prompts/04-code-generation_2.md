buatkan issue.md yang berisi perencanaan untuk nanti di implementasikan oleh junior programmer atau ai
model yang lebih murah.

Isi dari planning nya adalah sebagai berikut :

buat tabel sessions:

- id integer auto increment
- token varchar 255 not null (isinya UUID untuk token user yang login)
- user_id integer (FK ke tabel users)
- created_at timestamp default current_timestamp

buatkan API untuk registrasi login user

Endpoint : POST /api/users/login

Request Body :

{
"email": "mifta@locahost",
"password": "rahasia"
}

Response Body (Succees) :

{
"data": "token"
}
Response Body (Error) :
{
"error": "Email atau password salah"
}

Struktur folder di dalam src

- routes : ini berisi routing elysia js
- services : ini berisi logic atau bisnis aplikasi

Struktur file

- routes : menggunakan format misal user-routes.ts
- services : menggunakan format misal user-services.ts

Jelaskan tahapan-tahapan yang harus dilakukan untuk mengimplementasikan fitur ini, anggap saja nanti yang mengimplementasikan adalah junior programmer atau model AI yang lebih murah.

---

NOTE: Ganti model yang lebih murah, misal Gemini Flash

Implementasikan github issue https://github.com/miftawidaya/belajar-vibe-coding/issues/6

---

buatkan branch feature/user-login, commit di branch itu, lalu buat PR di github

---

Pindah ke branch main, lalu pull terbaru
