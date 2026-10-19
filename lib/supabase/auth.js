import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Koneksi sesi admin menggunakan Supabase Auth (@supabase/ssr) dan cookies.
 * Digunakan untuk login, keluar, ganti password, dan aksi admin lainnya.
 */
export async function createAuthClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_PUBLISHABLE_KEY belum diisi di environment variable."
    );
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Abaikan jika dipanggil dari Server Component
        }
      },
    },
  });
}

