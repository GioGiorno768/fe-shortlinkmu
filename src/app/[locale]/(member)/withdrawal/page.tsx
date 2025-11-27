// src/app/[locale]/(member)/withdrawal/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAlert } from "@/hooks/useAlert";
import { Loader2, Info } from "lucide-react"; // Tambah ikon Info
import type { WithdrawalStats, PaymentMethod, Transaction } from "@/types/type";

import WithdrawalStatsCard from "@/components/dashboard/withdrawal/WithdrawalStatsCard";
import WithdrawalMethodCard from "@/components/dashboard/withdrawal/WithdrawalMethodCard";
import TransactionTable from "@/components/dashboard/withdrawal/TransactionTable";
import WithdrawalRequestModal from "@/components/dashboard/withdrawal/WithdrawalRequestModal";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";

// --- (API Mocks tetep sama kayak sebelumnya, gua skip biar ringkas) ---
async function cancelWithdrawalAPI(id: string) {
  /* ... */ return { success: true };
}
async function fetchWithdrawalStats(): Promise<WithdrawalStats> {
  /* ... */ return {
    availableBalance: 154.2055,
    pendingWithdrawn: 12.5,
    totalWithdrawn: 450.0,
  };
}
async function fetchPaymentMethod(): Promise<PaymentMethod | null> {
  /* ... */ return {
    provider: "PayPal",
    accountName: "Kevin Ragil",
    accountNumber: "kevinragil768@gmail.com",
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
async function requestWithdrawalAPI(amount: number, method: PaymentMethod) {
  /* ... */ return { success: true };
}

export default function WithdrawalPage() {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [stats, setStats] = useState<WithdrawalStats | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // STATE MODAL CANCEL
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    txId: "",
    isLoading: false,
  });

  // 1. Handler Buka Modal
  const requestCancel = (id: string) => {
    setCancelModal({ isOpen: true, txId: id, isLoading: false });
  };

  // 2. Handler Eksekusi
  const onConfirmCancel = async () => {
    setCancelModal((prev) => ({ ...prev, isLoading: true }));

    // Panggil logic handleCancelRequest lu yg lama disini
    // Tapi modif dikit biar parameternya ambil dari state cancelModal.txId
    // ... (Salin logic API call handleCancelRequest disini) ...
    const txToCancel = transactions.find((t) => t.id === cancelModal.txId);

    if (txToCancel) {
      try {
        await cancelWithdrawalAPI(cancelModal.txId);
        showAlert("Permintaan penarikan dibatalkan.", "info");

        if (stats) {
          setStats({
            ...stats,
            availableBalance: stats.availableBalance + txToCancel.amount,
            pendingWithdrawn: stats.pendingWithdrawn - txToCancel.amount,
          });
        }
        setTransactions((prev) =>
          prev.map((t) =>
            t.id === cancelModal.txId ? { ...t, status: "cancelled" } : t
          )
        );
      } catch (error) {
        showAlert("Gagal membatalkan.", "error");
      }
    }

    setCancelModal({ isOpen: false, txId: "", isLoading: false });
  };

  // --- HANDLER CANCEL ---
  const handleCancelRequest = async (id: string) => {
    const txToCancel = transactions.find((t) => t.id === id);
    if (!txToCancel) return;

    if (
      !confirm(
        "Yakin ingin membatalkan penarikan ini? Saldo akan dikembalikan."
      )
    )
      return;

    try {
      await cancelWithdrawalAPI(id);
      showAlert("Permintaan penarikan dibatalkan.", "info");

      if (stats) {
        setStats({
          ...stats,
          availableBalance: stats.availableBalance + txToCancel.amount,
          pendingWithdrawn: stats.pendingWithdrawn - txToCancel.amount,
        });
      }

      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "cancelled" } : t))
      );
    } catch (error) {
      showAlert("Gagal membatalkan.", "error");
    }
  };

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

  // --- HANDLER SUKSES DARI MODAL ---
  const handleWithdrawalSuccess = async (
    amount: number,
    usedMethod: PaymentMethod
  ) => {
    await requestWithdrawalAPI(amount, usedMethod);
    showAlert("Permintaan penarikan berhasil dikirim!", "success");

    if (stats) {
      setStats({
        ...stats,
        availableBalance: stats.availableBalance - amount,
        pendingWithdrawn: stats.pendingWithdrawn + amount,
      });
    }

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
      {/* Grid Statistik & Metode */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <WithdrawalStatsCard
            stats={stats}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>
        <div className="lg:col-span-2">
          <WithdrawalMethodCard method={method} />
        </div>
      </div>

      {/* --- INFO CARD BARU --- */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4 text-blue-800 shadow-sm">
        <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
          <Info className="w-6 h-6 text-bluelight" />
        </div>
        <div className="text-[1.4em] leading-relaxed">
          <p>
            <span className="font-bold">Info Pembayaran:</span> Pembayaran akan
            diproses paling lambat <strong>3-5 hari</strong> setelah permintaan
            penarikan (tidak termasuk hari libur, Sabtu dan Minggu).
          </p>
          <p className="mt-2 text-blue-700/80 text-[0.95em]">
            Jika dalam waktu 3 hari setelah penarikan status selesai dan belum
            menerima pembayaran, silahkan menghubungi kami!
          </p>
        </div>
      </div>
      {/* ---------------------- */}

      {/* Tabel Transaksi */}
      <TransactionTable onCancel={requestCancel} transactions={transactions} />

      {/* Modal */}
      <WithdrawalRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultMethod={method}
        availableBalance={stats?.availableBalance || 0}
        onSuccess={handleWithdrawalSuccess}
      />

      {/* Pasang Modal */}
      <ConfirmationModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ ...cancelModal, isOpen: false })}
        onConfirm={onConfirmCancel}
        title="Batalkan Penarikan?"
        description="Saldo akan dikembalikan ke akun Anda. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Batalkan"
        type="warning"
        isLoading={cancelModal.isLoading}
      />
    </div>
  );
}
