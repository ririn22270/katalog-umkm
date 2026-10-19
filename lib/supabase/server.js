import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Koneksi server untuk membaca data publik (katalog dan detail produk).
 * Menggunakan SUPABASE_SECRET_KEY untuk melewati RLS di sisi server.
 */
export function createClient() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum diisi di environment variable."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = createClient;

