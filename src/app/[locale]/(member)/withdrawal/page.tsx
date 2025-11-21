"use client";

import { useState, useEffect } from "react";
import { useAlert } from "@/hooks/useAlert";
import { Loader2 } from "lucide-react";
import type { WithdrawalStats, PaymentMethod, Transaction } from "@/types/type";

import WithdrawalStatsCard from "@/components/dashboard/withdrawal/WithdrawalStatsCard";
import WithdrawalMethodCard from "@/components/dashboard/withdrawal/WithdrawalMethodCard";
import TransactionTable from "@/components/dashboard/withdrawal/TransactionTable";
// 1. IMPORT MODAL
import WithdrawalRequestModal from "@/components/dashboard/withdrawal/WithdrawalRequestModal";

// ... (Fungsi API Mock fetch stats, method, transaction SAMA AJA, gak perlu diubah) ...
// ... COPY PASTE FUNGSI FETCH DARI KODINGAN SEBELUMNYA ...
async function fetchWithdrawalStats(): Promise<WithdrawalStats> {
  await new Promise((r) => setTimeout(r, 500));
  return {
    availableBalance: 154.2055,
    pendingWithdrawn: 12.5,
    totalWithdrawn: 450.0,
  };
}
async function fetchPaymentMethod(): Promise<PaymentMethod | null> {
  await new Promise((r) => setTimeout(r, 500));
  return {
    provider: "PayPal",
    accountName: "Kevin Ragil",
    accountNumber: "kevin***@gmail.com",
  };
}
async function fetchTransactions(): Promise<Transaction[]> {
  await new Promise((r) => setTimeout(r, 500));
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

// Fungsi POST API Request Withdrawal (Update dikit terima parameter)
async function requestWithdrawalAPI(amount: number, method: PaymentMethod) {
  console.log(`MANGGIL API: POST /api/withdrawal/request`, { amount, method });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true };
}

export default function WithdrawalPage() {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);

  // 2. STATE MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // 3. HANDLER SUKSES DARI MODAL
  const handleWithdrawalSuccess = async (
    amount: number,
    usedMethod: PaymentMethod
  ) => {
    // Panggil API
    await requestWithdrawalAPI(amount, usedMethod);

    showAlert("Permintaan penarikan berhasil dikirim!", "success");

    // Update UI (Optimistic)
    if (stats) {
      setStats({
        ...stats,
        availableBalance: stats.availableBalance - amount,
        pendingWithdrawn: stats.pendingWithdrawn + amount,
      });
    }

    // Tambah ke tabel
    const newTx: Transaction = {
      id: `WTH-NEW-${Date.now()}`,
      date: new Date().toISOString(),
      amount: amount,
      method: usedMethod.provider,
      account: usedMethod.accountNumber,
      status: "pending",
    };
    setTransactions([newTx, ...transactions]);
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
        <div className="lg:col-span-2">
          <WithdrawalStatsCard
            stats={stats}
            onOpenModal={() => setIsModalOpen(true)} // Buka modal
          />
        </div>
        <div className="lg:col-span-1">
          <WithdrawalMethodCard method={method} />
        </div>
      </div>

      <TransactionTable transactions={transactions} />

      {/* 4. RENDER MODAL */}
      <WithdrawalRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultMethod={method}
        availableBalance={stats?.availableBalance || 0}
        onSuccess={handleWithdrawalSuccess}
      />
    </div>
  );
}
