"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("Reguler");

  const totalHarga = (produk?.harga || 0) * jumlah;
  const nomor = toko.nomorWhatsApp?.replace(/\D/g, "");

  const daftarVarian = ["Reguler", "Spesial / Hampers", "Custom Card"];

  const pesan = `Halo, saya ingin memesan:\n• Produk: ${produk.nama}\n• Varian: ${varian}\n• Jumlah: ${jumlah}\n• Total: ${formatRupiah(totalHarga)}`;
  const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Pilihan Varian (US-12) */}
      <div className="flex flex-col gap-1.5 text-sm">
        <label className="font-semibold text-teks">Pilihan Varian:</label>
        <div className="flex flex-wrap gap-2">
          {daftarVarian.map((v) => {
            const aktif = varian === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVarian(v)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  aktif
                    ? "border-utama bg-utama text-white"
                    : "border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pilihan Jumlah (US-12) */}
      <div className="flex items-center justify-between rounded-xl border border-garis bg-permukaan/50 p-3 text-sm">
        <div className="flex items-center gap-3">
          <label className="font-semibold text-teks">Jumlah:</label>
          <div className="flex items-center rounded-lg border border-garis bg-latar">
            <button
              type="button"
              onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-l-lg text-base font-bold text-teks-lembut hover:bg-permukaan focus:outline-none"
              aria-label="Kurangi jumlah"
            >
              -
            </button>
            <span className="w-10 text-center font-semibold text-teks">{jumlah}</span>
            <button
              type="button"
              onClick={() => setJumlah((prev) => prev + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-r-lg text-base font-bold text-teks-lembut hover:bg-permukaan focus:outline-none"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-teks-lembut">Total:</p>
          <p className="font-bold text-harga">{formatRupiah(totalHarga)}</p>
        </div>
      </div>

      {/* Tombol Pesan WhatsApp */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp ({jumlah} item)
      </a>
    </div>
  );
}
