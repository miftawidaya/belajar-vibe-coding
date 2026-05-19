buatkan issue.md yang berisi perencanaan untuk nanti di implementasikan oleh junior programmer atau ai
model yang lebih murah.

Isi dari planning nya adalah sebagai berikut :

buat tabel users:

- id integer auto increment
- name varchar 255 not null
- email varchar 255 not null unique
- password varchar 255 not null (password merupakan hash dari bcrypt)
- created_at timestamp default current_timestamp

buatkan API untuk registrasi user baru

Endpoint : POST /api/users
Request Body :

{
"name": "Mifta",
"email": "mifta@locahost",
"password": "rahasia"
}

Response Body (Succees) :

{
"data": "OK"
}
Response Body (Error) :
{
"error": "Email sudah terdaftar"
}

Struktur folder di dalam src

- routes : ini berisi routing elysia js
- services : ini berisi logic atau bisnis aplikasi

Struktur file

- routes : menggunakan format misal user-routes.ts
- services : menggunakan format misal user-services.ts

Jelaskan tahapan-tahapan yang harus dilakukan untuk mengimplementasikan fitur ini, anggap saja nanti yang mengimplementasikan adalah junior programmer atau model AI yang lebih murah.

---

submit hasil dari @issue.md sebagai github issue baru

---

NOTE: Ganti model yang lebih murah, misal Gemini Flash

Implementasikan github issue https://github.com/miftawidaya/belajar-vibe-coding/issues/4

---

Commit dan buatkan PR ke branch main

---

Kembali ke branch main, lalu pull terbaru
