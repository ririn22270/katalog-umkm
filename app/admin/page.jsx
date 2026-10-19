import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createAuthClient } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  const supabase = await createAuthClient();
  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("*")
    .order("id", { ascending: true });

  const produkList = daftarProduk || [];

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {error ? (
        <div className="rounded-xl border border-garis bg-permukaan p-4 text-center text-sm font-semibold text-bahaya">
          Gagal mengambil data produk dari database.
        </div>
      ) : produkList.length === 0 ? (
        <p className="py-12 text-center text-teks-lembut">Belum ada produk</p>
      ) : (
        <TabelProduk daftarProduk={produkList} />
      )}
    </div>
  );
}
