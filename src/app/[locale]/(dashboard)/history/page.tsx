"use client";

import { useState, useEffect } from "react";
import { useAlert } from "@/hooks/useAlert";
import { Loader2, History as HistoryIcon } from "lucide-react";
import type { ActivityLog } from "@/types/type";
import ActivityHistoryList from "@/components/dashboard/history/ActivityHistoryList";

// ========================================================
// === SETUP API (MOCK/DUMMY) ===
// ========================================================
async function fetchActivityLogs(): Promise<ActivityLog[]> {
  console.log("MANGGIL API: /api/user/activity-logs");
  /* // --- CONTOH API CALL ---
  // const res = await fetch('/api/user/activity-logs');
  // return res.json();
  */

  await new Promise((resolve) => setTimeout(resolve, 800));

  // Dummy Data: Campuran berbagai jenis aktivitas
  return [
    {
      id: "act-1",
      type: "login",
      title: "Login Berhasil",
      description: "Login via Email dari Chrome Windows",
      timestamp: new Date().toISOString(), // Hari ini
      ipAddress: "192.168.1.10",
      device: "Windows 11 / Chrome 120",
      status: "success",
    },
    {
      id: "act-2",
      type: "link",
      title: "Link Baru Dibuat",
      description: "Membuat shortlink 'short.link/promo-gacor'",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 jam lalu
      status: "success",
    },
    {
      id: "act-3",
      type: "security",
      title: "Password Diubah",
      description: "Password akun berhasil diperbarui",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Kemarin
      ipAddress: "192.168.1.10",
      status: "warning",
    },
    {
      id: "act-4",
      type: "payment",
      title: "Penarikan Dana Request",
      description: "Request withdraw sebesar $50.00 via PayPal",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Kemarin
      status: "success",
    },
    {
      id: "act-5",
      type: "login",
      title: "Percobaan Login Gagal",
      description: "Password salah 3x",
      timestamp: "2025-11-15T08:00:00Z",
      ipAddress: "10.0.0.5",
      device: "Unknown Device",
      status: "failed",
    },
    {
      id: "act-6",
      type: "link",
      title: "Link Diedit",
      description: "Mengubah alias link 'short.link/my-file'",
      timestamp: "2025-11-14T14:30:00Z",
      status: "success",
    },
    {
      id: "act-7",
      type: "system",
      title: "Level Up!",
      description: "Selamat! Akun Anda naik ke level 'Medium'",
      timestamp: "2025-11-10T10:00:00Z",
      status: "success",
    },
  ];
}

export default function HistoryPage() {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchActivityLogs();
        setLogs(data);
      } catch (error) {
        showAlert("Gagal memuat riwayat aktivitas.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [showAlert]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree pb-10">
      {/* Header Page */}
      <div className="mb-8">
        <h1 className="text-[2.5em] font-bold text-shortblack flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-2xl text-bluelight">
            <HistoryIcon className="w-8 h-8" />
          </div>
          Riwayat Aktivitas
        </h1>
        <p className="text-[1.6em] text-grays mt-2 ml-2">
          Pantau semua kejadian penting yang terjadi pada akun Anda.
        </p>
      </div>

      {/* List Component */}
      <ActivityHistoryList activities={logs} />
    </div>
  );
}
