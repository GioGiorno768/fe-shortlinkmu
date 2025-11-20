"use client";

import { useState, useEffect } from "react";
import { useAlert } from "@/hooks/useAlert";
import { Loader2 } from "lucide-react";
import type { WithdrawalStats, PaymentMethod, Transaction } from "@/types/type";

// Import Komponen
import WithdrawalStatsCard from "@/components/dashboard/withdrawal/WithdrawalStatsCard";
import WithdrawalMethodCard from "@/components/dashboard/withdrawal/WithdrawalMethodCard";
import TransactionTable from "@/components/dashboard/withdrawal/TransactionTable";

// ========================================================
// === SETUP API (MOCK/DUMMY) ===
// ========================================================

async function fetchWithdrawalStats(): Promise<WithdrawalStats> {
  console.log("MANGGIL API: /api/withdrawal/stats");
  // const res = await fetch('/api/withdrawal/stats'); return res.json();
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    availableBalance: 154.2055, // Ada 4 desimal
    pendingWithdrawn: 12.5,
    totalWithdrawn: 450.0,
  };
}

async function fetchPaymentMethod(): Promise<PaymentMethod | null> {
  console.log("MANGGIL API: /api/user/payment-method");
  // const res = await fetch('/api/user/payment-method'); return res.json();
  await new Promise((resolve) => setTimeout(resolve, 700));
  return {
    provider: "PayPal",
    accountName: "Kevin Ragil",
    accountNumber: "kevinragil***@gmail.com",
  };
  // Return null kalau user belum set method
}

async function fetchTransactions(): Promise<Transaction[]> {
  console.log("MANGGIL API: /api/withdrawal/history");
  // const res = await fetch('/api/withdrawal/history'); return res.json();
  await new Promise((resolve) => setTimeout(resolve, 900));
  return [
    {
      id: "WTH-003",
      date: "2025-11-18T10:00:00Z",
      amount: 12.5,
      method: "PayPal",
      account: "kevin***@gmail.com",
      status: "pending",
    },
    {
      id: "WTH-002",
      date: "2025-11-01T14:30:00Z",
      amount: 50.0,
      method: "Bank Transfer",
      account: "1234****",
      status: "completed",
      txId: "TRX123456789",
    },
    {
      id: "WTH-001",
      date: "2025-10-15T09:15:00Z",
      amount: 25.0,
      method: "PayPal",
      account: "kevin***@gmail.com",
      status: "rejected", // Contoh rejected
    },
  ];
}

// Endpoint POST buat request withdrawal
async function requestWithdrawalAPI(amount: number) {
  console.log(
    `MANGGIL API: POST /api/withdrawal/request { amount: ${amount} }`
  );
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulasi loading
  // return { success: true };
}

// ========================================================

export default function WithdrawalPage() {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);

  const [stats, setStats] = useState<WithdrawalStats | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [statsData, methodData, historyData] = await Promise.all([
          fetchWithdrawalStats(),
          fetchPaymentMethod(),
          fetchTransactions(),
        ]);
        setStats(statsData);
        setMethod(methodData);
        setTransactions(historyData);
      } catch (error) {
        showAlert("Gagal memuat data withdrawal.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [showAlert]);

  const handleRequestWithdrawal = async () => {
    if (!stats || stats.availableBalance < 5.0) {
      showAlert("Saldo belum mencukupi (Min $5.00)", "error");
      return;
    }
    if (!method) {
      showAlert("Silakan atur metode pembayaran di Settings dulu.", "warning");
      return;
    }

    // Konfirmasi (Bisa diganti modal beneran kalo mau)
    if (!confirm("Apakah Anda yakin ingin menarik semua saldo yang tersedia?"))
      return;

    setIsRequesting(true);
    try {
      await requestWithdrawalAPI(stats.availableBalance);
      showAlert("Permintaan penarikan berhasil dikirim!", "success");

      // Refresh data (Simulasi ngurangin saldo)
      setStats({
        ...stats,
        availableBalance: 0,
        pendingWithdrawn: stats.pendingWithdrawn + stats.availableBalance,
      });
      // Tambah transaksi baru ke tabel (Optimistic update)
      const newTx: Transaction = {
        id: `WTH-NEW-${Date.now()}`,
        date: new Date().toISOString(),
        amount: stats.availableBalance,
        method: method.provider,
        account: method.accountNumber,
        status: "pending",
      };
      setTransactions([newTx, ...transactions]);
    } catch (error) {
      showAlert("Gagal mengirim permintaan.", "error");
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
      </div>
    );
  }

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree space-y-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Stats (Lebar 2 kolom) */}
        <div className="lg:col-span-2">
          <WithdrawalStatsCard
            stats={stats}
            onRequest={handleRequestWithdrawal}
            isProcessing={isRequesting}
          />
        </div>

        {/* Kolom Kanan: Active Method (Lebar 1 kolom) */}
        <div className="lg:col-span-1">
          <WithdrawalMethodCard method={method} />
        </div>
      </div>

      {/* Tabel History */}
      <TransactionTable transactions={transactions} />
    </div>
  );
}
