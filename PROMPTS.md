# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Halaman utama berhasil mengambil seluruh daftar produk dari tabel produk di Supabase di sisi server.

**Perbaikan:**
- Menambahkan sanitasi `.trim()` pada pembacaan environment variable agar whitespace yang tidak sengaja tertulis pada `.env.local` tidak menyebabkan invalid URL / key error.
- Menambahkan `export const dynamic = "force-dynamic"` agar daftar produk selalu fresh setiap kali halaman dimuat.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- Halaman `app/produk/[id]/page.jsx` berhasil mengambil data satu produk dari tabel `produk` di Supabase berdasarkan `id` dinamis URL di sisi server.
- Komponen `TombolWhatsApp` dipertahankan dan komponen `CatatanBelumAktif` dihapus.
- Seluruh tampilan, layout grid, dan typography tetap dipertahankan sesuai desain awal.

**Perbaikan:**
- Menggunakan query `.maybeSingle()` dari Supabase agar saat produk dengan ID tertentu tidak ada, Supabase tidak menganggapnya sebagai error runtime, melainkan mengembalikan `data: null` sehingga dapat diteruskan ke fungsi `notFound()`.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- Komponen `components/TombolWhatsApp.jsx` diubah dari elemen `<button>` menjadi tautan `<a>` yang mengarah ke `https://wa.me/<nomor>?text=<pesan>`.
- Nomor WhatsApp diambil langsung dari `lib/toko.js`.
- Tampilan styling tombol tetap dipertahankan.
- Catatan non-aktif terkait US-03 di halaman detail produk telah dibersihkan.

**Perbaikan:**
- Menambahkan pembersihan regex `.replace(/\D/g, "")` pada nomor toko untuk memastikan nomor yang dikirimkan ke wa.me bersih dari tanda `+`, spasi, atau tanda minus.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Dibuat koneksi sesi admin di `lib/supabase/auth.js` menggunakan `@supabase/ssr` dan cookie store (`next/headers`).
- Dibuat Server Action `login` dan `logout` di `app/admin/actions.js`.
- Form login di `app/admin/login/page.jsx` dihubungkan ke Server Action menggunakan React 19 `useActionState`.
- Jika login berhasil, browser dialihkan ke `/admin`. Jika gagal, pesan error yang jelas ditampilkan dengan styling `text-bahaya`.

**Perbaikan:**
- Mengintegrasikan tombol "Keluar" di `NavAdmin` ke dalam form Server Action dengan `className="ml-auto"` sehingga posisinya di ujung kanan navbar tetap terjaga presisi tanpa mengubah tampilan CSS.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Dibuat Server Action `gantiPassword` di `app/admin/actions.js` yang memanfaatkan fungsi `supabase.auth.updateUser`.
- Validasi sisi server diterapkan: memeriksa bahwa admin sedang aktif login (`supabase.auth.getUser()`), password baru minimal 8 karakter, dan konfirmasi password sesuai.
- Form di `app/admin/password/page.jsx` dihubungkan ke Server Action menggunakan `useActionState`.

**Perbaikan:**
- Memastikan pengecekan login admin dilakukan di awal fungsi Server Action untuk memenuhi aturan keamanan nomor 3 di `AGENTS.md`.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Dibuat file `proxy.js` di root proyek sebagai pengganti `middleware.js` sesuai standar Next.js 16.
- Rute-rute di bawah `/admin` (seperti `/admin`, `/admin/password`, `/admin/produk/*`) diproteksi dengan memeriksa autentikasi `supabase.auth.getUser()`.
- Pengguna yang belum login otomatis dialihkan ke `/admin/login`, sementara rute `/admin/login` tetap dapat diakses publik.

**Perbaikan:**
- Menambahkan konfigurasi `export const config = { matcher: ["/admin/:path*"] }` agar middleware hanya dieksekusi pada path admin dan tidak membebani rute katalog publik.

## Debugging dan fitur bonus

### US-07 List Produk Admin dari Database
- Mengubah `app/admin/page.jsx` agar mengambil daftar produk langsung dari database Supabase menggunakan `createAuthClient()`.
- Menghapus data contoh `produkContoh` dan menampilkan produk asli ke `TabelProduk`.

### US-08 Tambah Produk Admin
- Membuat Server Action `tambahProduk` di `app/admin/actions.js` yang terkunci autentikasi admin.
- Menghubungkan form di `app/admin/produk/baru/page.jsx` via komponen `FormProduk` dengan action `tambahProduk`.
- Menyimpan produk baru ke tabel `produk`, merevalidasi path `/admin` dan `/`, lalu dialihkan kembali ke `/admin`.

### US-09 Ubah Produk Admin
- Mengubah `app/admin/produk/[id]/ubah/page.jsx` untuk mengambil data produk lama dari database Supabase.
- Membuat Server Action `ubahProduk` di `app/admin/actions.js` yang terkunci autentikasi admin.
- Memperbarui data produk ke tabel `produk`, merevalidasi cache, lalu dialihkan kembali ke `/admin`.

### US-10 Hapus Produk Admin
- Mengubah `components/TabelProduk.jsx` agar tombol "Hapus" meminta konfirmasi dialog browser `confirm(...)`.
- Membuat Server Action `hapusProduk` di `app/admin/actions.js` yang terkunci autentikasi admin untuk menghapus baris produk dari database.
