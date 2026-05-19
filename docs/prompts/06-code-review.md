buatkan issue.md yang berisi perencanaan untuk nanti di implementasikan oleh junior programmer atau ai
model yang lebih murah.

Isi dari planning nya adalah sebagai berikut :

buatkan API untuk logout user

Endpoint : DELETE /api/users/logout

Headers :
-Authorization: Bearer <token> (token adalah token yang ada di table users)

Request Body (Success) :

{
"data" : "OK"
}

Jika sukses logout, maka data session dengan token tersebut harus dihapus dari table sessions.

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

NOTE: ganti model yang lebih murah dulu sebelum mengimplementasikan.

buat branch baru bernama feature/logout
lalu mplementasikan github issue #10 pada branch tersebut.

setelah selesai, commit dan buat PR ke branch main. namun jangan merge PR ke branch main, biarkan PR terbuka untuk code review.

---

coba review PR ini apakah ada yang masih perlu ditingkatkan atau tidak, jika ada tambahkan komentar pada PR tersebut:
https://github.com/miftawidaya/belajar-vibe-coding/pull/11

---

Buka github pada PR:

- Lakukan code review
- Merge PR ke branch main
- Delete branch feature/get-current-user

---

Pindah ke branch main, lalu pull terbaru
