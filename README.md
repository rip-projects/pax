PAX
===

[![License](http://img.shields.io/npm/l/xinix-pax.svg?style=flat-square)](https://github.com/xinix-technology/pax/blob/master/LICENSE)
[![Download](http://img.shields.io/npm/dm/xinix-pax.svg?style=flat-square)](https://github.com/xinix-technology/pax)
[![NPM](http://img.shields.io/npm/v/xinix-pax.svg?style=flat-square)](https://github.com/xinix-technology/pax)

pax / xpax (cli) / xinix-pax (npm) adalah sebuah Aplikasi package automation control. Tujuannya adalah untuk memberikan kemudahan kepada developer untuk mengatur siklus kerja dari aplikasi yang dibangunnya.

pax secara umum saat ini digunakan secara internal pada PT Sagara Xinix Solusitama untuk membantu dalam pengembangan piranti lunak dan sistem baik untuk bahasa pemrograman PHP maupun Javascript.

Dengan menggunakan pax, mempermudah pekerjaan seperti ini:

- Inisialisasi proyek dengan menggunakan archetype yang telah ada
- Inisialisasi proyek dengan menggunakan proyek lain sebagai archetype
- Satu perintah untuk mengatur ketergantungan pustaka baik itu PHP (composer) maupun Javascript (bower atau npm).
- Menjalankan server development secara internal.
- Mengatur script untuk melakukan migrasi antar versi

## Instalasi

pax di-install secara global untuk menambahkan perintah baru pada terminal / command-line anda. pax dibangun di atas teknologi node.js sehingga anda harus menginstall node.js terlebih dahulu hingga anda dapat menggunakan npm yang dibutuhkan untuk melakukan instalasi.

```bash
npm install -g xinix-pax
```

## Archetype

Archetype adalah sebuah konsep scaffolding dari template proyek. Hal ini dapat membantu anda untuk memulai sebuah proyek.

## Bagaimana cara melakukan sesuatu?

Kami menginginkan developer dapat untuk menggunakan pax secara intuitif seperti saat mereka menggunakan npm, bower, composer, dll.

### Pencarian archetype yang tersedia

Anda ingin memulai sebuah proyek dan anda ingin tahu ada archetype apa yang sudah tersedia di sistem pax pada saat ini? Anda dapat melakukan pencarian dengan mengetik pada terminal perintah berikut ini,

```bash
xpax search [$ARCHETYPE_TO_SEARCH]
```

### Inisialisasi proyek

Perintah inisialisasi sedikit berbeda dari npm, bower atau pun composer. Karena pax memiliki archetype untuk melakukan scaffolding pada proyek anda. Pada saat menjalankan perintah init, argumen ke-3 dari perintah ini adalah nama archetype yang ingin digunakan. Selain itu argumen ke-3 ini juga bisa berupa url dari git.

```bash
mkdir $PROJECT_DIR
cd $PROJECT_DIR
xpax init $ARCHETYPE_NAME|$ARCHETYPE_GIT_URL
```

### Melakukan tugas tertentu

Perintah "task" akan menampilkan tugas-tugas yang ada yang bisa dilakukan dalam sebuah skup proyek tertentu. Untuk menambah tugas-tugas yang baru dapat dilakukan dengan menambah scripting pada file paxfile.js di direktori proyek anda.

```
cd $PROJECT_DIR
xpax task
```
