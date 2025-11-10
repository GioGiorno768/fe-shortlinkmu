// src/app/[locale]/[...not_found]/page.tsx
import { notFound } from "next/navigation";

/**
 * Catch-all route untuk semua path yang tidak ditemukan
 *
 * Cara kerja:
 * - User akses /en/random-path → route ini ke-trigger
 * - Langsung panggil notFound() → redirect ke /en/not-found
 *
 * Kenapa pake [...not_found] bukan [...rest]?
 * - Lebih jelas intent-nya (ini buat handle 404)
 * - Avoid conflict dengan dynamic routes lain
 */
export default function CatchAllNotFound() {
  // Trigger 404 handler
  notFound();
}

/**
 * PENTING: Jangan export metadata di sini
 * Karena ini cuma redirect handler, bukan actual page
 */
