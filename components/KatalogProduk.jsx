"use client";

import { useState, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function KatalogProduk({ daftarProduk }) {
  const [cari, setCari] = useState("");
  const [kategoriTerpilih, setKategoriTerpilih] = useState("Semua");

  const daftarKategori = useMemo(() => {
    const setKat = new Set();
    daftarProduk.forEach((p) => {
      if (p.kategori) setKat.add(p.kategori);
    });
    return ["Semua", ...Array.from(setKat)];
  }, [daftarProduk]);

  const produkTersaring = useMemo(() => {
    return daftarProduk.filter((p) => {
      const cocokKategori =
        kategoriTerpilih === "Semua" || p.kategori === kategoriTerpilih;
      const cocokCari = p.nama.toLowerCase().includes(cari.toLowerCase().trim());
      return cocokKategori && cocokCari;
    });
  }, [daftarProduk, cari, kategoriTerpilih]);

  return (
    <div className="flex flex-col gap-6">
      {/* Kontrol Pencarian & Filter Kategori (US-11) */}
      <div className="flex flex-col gap-3">
        {/* Input Pencarian */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            className="w-full rounded-xl border border-garis bg-latar px-4 py-2.5 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
          {cari && (
            <button
              type="button"
              onClick={() => setCari("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-teks-lembut hover:text-teks"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Filter Kategori */}
        {daftarKategori.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            {daftarKategori.map((kategori) => {
              const aktif = kategori === kategoriTerpilih;
              return (
                <button
                  key={kategori}
                  type="button"
                  onClick={() => setKategoriTerpilih(kategori)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    aktif
                      ? "bg-utama text-white"
                      : "border border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
                  }`}
                >
                  {kategori}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid Produk Tersaring */}
      {produkTersaring.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-garis py-12 text-center text-sm text-teks-lembut">
          Tidak ada produk yang cocok dengan pencarian &quot;{cari}&quot;
          {kategoriTerpilih !== "Semua" && ` pada kategori ${kategoriTerpilih}`}.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTersaring.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}

