"use client";

import { useTranslations } from "next-intl";
// Nanti lu bisa bikin komponen khusus kayak 'ServerStatusCard' atau 'GlobalRevenue'
// import SuperAdminStats from "@/components/dashboard/super-admin/SuperAdminStats";

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-8 pb-24 text-[10px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[2.4em] font-bold text-red-600 flex items-center gap-2">
            Super Admin Control 🛡️
          </h1>
          <p className="text-gray-400 text-[1.4em]">
            Global system monitoring and configuration.
          </p>
        </div>
      </div>

      {/* Area Konten Super Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Contoh Card Placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-[1.4em] font-bold text-shortblack">
            Server Status
          </h3>
          <p className="text-[2em] font-bold text-green-500 mt-2">Healthy</p>
          <p className="text-gray-400 text-[1.1em]">CPU: 12% | RAM: 45%</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-[1.4em] font-bold text-shortblack">
            Total Admins
          </h3>
          <p className="text-[2em] font-bold text-blue-500 mt-2">5 Staff</p>
          <p className="text-gray-400 text-[1.1em]">2 Active Now</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-[1.4em] font-bold text-shortblack">
            Global Revenue
          </h3>
          <p className="text-[2em] font-bold text-orange-500 mt-2">$15,420</p>
          <p className="text-gray-400 text-[1.1em]">All time platform profit</p>
        </div>
      </div>

      {/* Nanti di sini bisa tambah Table Audit Log dll */}
    </div>
  );
}
