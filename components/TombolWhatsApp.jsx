"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("");

  const nomor = toko.nomorWhatsApp?.replace(/\D/g, "");
  const totalHarga = (produk?.harga || 0) * jumlah;

  // Bangun baris varian hanya jika ada isi
  const barisVarian = varian.trim() ? `\n• Varian: ${varian.trim()}` : "";
  const pesan =
    `Halo, saya ingin memesan:\n` +
    `• Produk: ${produk.nama}${barisVarian}\n` +
    `• Jumlah: ${jumlah}\n` +
    `• Harga satuan: ${formatRupiah(produk.harga)}\n` +
    `• Total: ${formatRupiah(totalHarga)}`;
  const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Pilihan Varian — boleh dikosongkan jika tidak ada varian */}
      <div className="flex flex-col gap-1.5 text-sm">
        <label htmlFor="varian" className="font-semibold text-teks">
          Varian / catatan <span className="font-normal text-teks-lembut">(opsional)</span>
        </label>
        <input
          id="varian"
          type="text"
          placeholder="Contoh: Merah, Ukuran M, Tanpa pedas..."
          value={varian}
          onChange={(e) => setVarian(e.target.value)}
          className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      {/* Pilihan Jumlah */}
      <div className="flex items-center gap-4 text-sm">
        <span className="font-semibold text-teks">Jumlah:</span>
        <div className="flex items-center rounded-lg border border-garis bg-latar">
          <button
            type="button"
            onClick={() => setJumlah((j) => Math.max(1, j - 1))}
            aria-label="Kurangi jumlah"
            className="flex h-9 w-9 items-center justify-center rounded-l-lg text-lg font-bold text-teks-lembut hover:bg-permukaan"
          >
            −
          </button>
          <span className="w-10 text-center font-semibold">{jumlah}</span>
          <button
            type="button"
            onClick={() => setJumlah((j) => j + 1)}
            aria-label="Tambah jumlah"
            className="flex h-9 w-9 items-center justify-center rounded-r-lg text-lg font-bold text-teks-lembut hover:bg-permukaan"
          >
            +
          </button>
        </div>

        {/* Total harga perkiraan */}
        <div className="ml-auto text-right">
          <p className="text-xs text-teks-lembut">Total perkiraan</p>
          <p className="text-base font-bold text-harga">{formatRupiah(totalHarga)}</p>
        </div>
      </div>

      {/* Tombol Pesan */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
        {jumlah > 1 && (
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
            {jumlah} item
          </span>
        )}
      </a>
    </div>
  );
}
