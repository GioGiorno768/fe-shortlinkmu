"use client";

import Link from "next/link";
import { ArrowLeft, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import clsx from "clsx";
import type { UserStatus } from "@/types/type";
import ConfirmationModal from "../../ConfirmationModal";
import { useAlert } from "@/hooks/useAlert";

interface UserDetailHeaderProps {
  status: UserStatus;
  onToggleStatus: () => Promise<void>;
}

export default function UserDetailHeader({
  status,
  onToggleStatus,
}: UserDetailHeaderProps) {
  const t = useTranslations("AdminDashboard.UserDetail");
  const { showAlert } = useAlert();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSuspended = status === "suspended";

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onToggleStatus();
      showAlert(
        isSuspended
          ? "User account has been reactivated successfully."
          : "User account has been suspended.",
        "success",
        isSuspended ? "Account Reactivated" : "Account Suspended"
      );
      setIsModalOpen(false);
    } catch (error) {
      showAlert("Failed to update user status.", "error", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-grays hover:text-shortblack transition-colors font-medium text-[1.2em] mb-4"
      >
        <ArrowLeft className="w-5 h-5" /> {t("backToUsers")}
      </Link>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[2.5em] font-bold text-shortblack">
            {t("title")}
          </h1>
          <p className="text-[1.4em] text-grays">{t("subtitle")}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-gray-200 bg-white text-shortblack font-semibold text-[1.2em] hover:bg-gray-50 transition-colors">
            {t("resetPassword")}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className={clsx(
              "flex-1 md:flex-none px-6 py-3 rounded-xl font-semibold text-[1.2em] transition-colors flex items-center justify-center gap-2 shadow-lg",
              isSuspended
                ? "bg-green-600 text-white hover:bg-green-700 shadow-green-200"
                : "bg-red-600 text-white hover:bg-red-700 shadow-red-200"
            )}
          >
            {isSuspended ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> Activate Account
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5" /> {t("suspendAccount")}
              </>
            )}
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={isSuspended ? "Reactivate Account?" : "Suspend Account?"}
        description={
          isSuspended
            ? "This user will regain access to their dashboard and all features immediately."
            : "Are you sure you want to suspend this user? They will lose access to their dashboard immediately."
        }
        confirmLabel={isSuspended ? "Reactivate User" : "Yes, Suspend User"}
        cancelLabel="Cancel"
        type={isSuspended ? "success" : "danger"}
        isLoading={isLoading}
      />
    </div>
  );
}
