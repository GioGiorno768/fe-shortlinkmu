"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import type { ReferredUser } from "@/types/type";

interface ReferralTableProps {
  users: ReferredUser[];
}

export default function ReferralTable({ users }: ReferralTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Kita set 5 atau 10, terserah selera lu

  const formatCurrency = (val: number) => `$${val.toFixed(2)}`;

  // 1. Filter Data (Search)
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.emailHidden.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Reset Page kalau search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 3. Hitung Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Handler Ganti Halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-[1.8em] font-bold text-shortblack">Daftar Teman</h3>

        {/* Search Bar */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grays" />
          <input
            type="text"
            placeholder="Cari user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg bg-blues text-[1.4em] w-full focus:outline-none focus:ring-2 focus:ring-bluelight/20 text-shortblack"
          />
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-blues text-grays uppercase text-[1.2em] font-semibold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Tanggal Gabung</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Penghasilan (Utk Anda)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentData.length > 0 ? (
              currentData.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-shortblack text-[1.4em]">
                      {user.name}
                    </div>
                    <div className="text-grays text-[1.2em]">
                      {user.emailHidden}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[1.4em] text-grays">
                    {new Date(user.dateJoined).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        "px-3 py-1 rounded-full text-[1.2em] font-medium",
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-bluelight text-[1.4em]">
                    {formatCurrency(user.totalEarningsForMe)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-grays text-[1.4em]"
                >
                  {searchTerm
                    ? "User tidak ditemukan."
                    : "Belum ada teman yang diajak."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER PAGINATION --- */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 bg-white text-shortblack hover:bg-blues disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={clsx(
                "w-8 h-8 rounded-lg text-[1.2em] font-bold transition-all",
                currentPage === page
                  ? "bg-bluelight text-white shadow-md shadow-blue-200"
                  : "bg-white border border-gray-200 text-shortblack hover:bg-blues"
              )}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 bg-white text-shortblack hover:bg-blues disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
