buatkan @issue.md yang berisi perencanaan untuk nanti di implementasikan oleh junior programmer atau ai
model yang lebih murah.

Isi dari planning nya adalah sebagai berikut :

buatkan API untuk get user yang sedang login

Endpoint : POST /api/users/current

Headers :
-Authorization: Bearer <token> (token adalah token yang ada di table users)

Request Body (Success) :

{
"data" : {
"id": 1,
"name": "mifta",
"email": "mifta@localhost",
"created_at": "timestamp"
}
}

Response Body (Error) :
{
"error": "Unauthorized"
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

Implementasikan github issue https://github.com/miftawidaya/belajar-vibe-coding/issues/8 pada branch feature/get-current-user

setelah selesai, commit dan buat PR ke branch main. namun jangan merge PR ke branch main, biarkan PR terbuka untuk code review.

---

Buka github pada PR:

- Lakukan code review
- Merge PR ke branch main
- Delete branch feature/get-current-user

---

Pindah ke branch main, lalu pull terbaru
