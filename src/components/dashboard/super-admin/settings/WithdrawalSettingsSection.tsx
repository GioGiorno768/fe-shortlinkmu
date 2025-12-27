"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Loader2,
  Wallet,
  Building2,
  Bitcoin,
  Filter,
} from "lucide-react";
import clsx from "clsx";
import { usePaymentTemplates } from "@/hooks/usePaymentTemplates";
import type { PaymentMethodTemplate } from "@/services/paymentTemplateAdminService";
import PaymentMethodCard from "../PaymentMethodCard";
import PaymentMethodModal from "../PaymentMethodModal";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import WithdrawalLimitsCard from "./WithdrawalLimitsCard";
import { useAlert } from "@/hooks/useAlert";
import apiClient from "@/services/apiClient";

const TYPE_FILTERS = [
  { value: "all", label: "All", icon: Filter },
  { value: "wallet", label: "Wallet", icon: Wallet },
  { value: "bank", label: "Bank", icon: Building2 },
  { value: "crypto", label: "Crypto", icon: Bitcoin },
];

interface WithdrawalLimits {
  min_amount: number;
  max_amount: number;
  limit_count: number;
  limit_days: number;
}

export default function WithdrawalSettingsSection() {
  const { showAlert } = useAlert();
  const {
    templates,
    isLoading,
    isSubmitting,
    filter,
    setFilter,
    stats,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleActive,
  } = usePaymentTemplates();

  // Withdrawal Limits state - connected to backend
  const [withdrawalLimits, setWithdrawalLimits] = useState<WithdrawalLimits>({
    min_amount: 2.0,
    max_amount: 0,
    limit_count: 0,
    limit_days: 1,
  });
  const [isLimitsLoading, setIsLimitsLoading] = useState(true);

  // Fetch withdrawal limits on mount
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const response = await apiClient.get("/admin/settings/withdrawal");
        // Backend returns {status: "success"} not {success: true}
        if (response.data.status === "success") {
          setWithdrawalLimits(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch withdrawal limits:", error);
      } finally {
        setIsLimitsLoading(false);
      }
    };
    fetchLimits();
  }, []);

  const handleUpdateLimits = async (limits: WithdrawalLimits) => {
    try {
      const response = await apiClient.put(
        "/admin/settings/withdrawal",
        limits
      );
      // Backend returns {status: "success"} not {success: true}
      if (response.data.status === "success") {
        setWithdrawalLimits(response.data.data);
        showAlert(
          "Withdrawal limits updated successfully!",
          "success",
          "Settings Saved"
        );
      }
    } catch (error) {
      console.error("Failed to update withdrawal limits:", error);
      showAlert("Failed to update withdrawal limits", "error", "Error");
      throw error;
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<PaymentMethodTemplate | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingTemplate, setDeletingTemplate] =
    useState<PaymentMethodTemplate | null>(null);

  const openCreateModal = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const openEditModal = (template: PaymentMethodTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editingTemplate) {
      await handleUpdate(editingTemplate.id, data);
    } else {
      await handleCreate(data);
    }
  };

  const handleDeleteClick = (template: PaymentMethodTemplate) => {
    setDeletingTemplate(template);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingTemplate) {
      await handleDelete(deletingTemplate.id);
      setIsConfirmOpen(false);
      setDeletingTemplate(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Withdrawal Limits Card */}
      <WithdrawalLimitsCard
        limits={withdrawalLimits}
        onUpdate={handleUpdateLimits}
        isLoading={isLimitsLoading}
      />

      {/* Payment Methods Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[2em] font-bold text-shortblack">
            Payment Methods
          </h2>
          <p className="text-grays text-[1.3em]">
            Manage available payment methods for user withdrawals
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-shortblack text-white px-5 py-2.5 rounded-xl font-semibold text-[1.3em] hover:bg-opacity-90 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Method
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-[2em] font-bold text-shortblack">{stats.total}</p>
          <p className="text-[1.2em] text-grays">Total Methods</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-[2em] font-bold text-green-600">{stats.active}</p>
          <p className="text-[1.2em] text-green-700">Active</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-[2em] font-bold text-purple-600">
            {stats.byType.wallet}
          </p>
          <p className="text-[1.2em] text-purple-700">Wallets</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-[2em] font-bold text-blue-600">
            {stats.byType.bank}
          </p>
          <p className="text-[1.2em] text-blue-700">Banks</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TYPE_FILTERS.map((f) => {
          const isActive = (filter.type || "all") === f.value;
          return (
            <button
              key={f.value}
              onClick={() =>
                setFilter({
                  ...filter,
                  type: f.value === "all" ? undefined : f.value,
                })
              }
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-[1.2em] transition-all",
                isActive
                  ? "bg-shortblack text-white shadow-md"
                  : "bg-white text-grays border border-gray-200 hover:border-gray-300"
              )}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-bluelight" />
          </div>
          <h3 className="text-[1.8em] font-bold text-shortblack mb-2">
            No Payment Methods
          </h3>
          <p className="text-grays text-[1.3em] mb-4">
            Add your first payment method template
          </p>
          <button
            onClick={openCreateModal}
            className="bg-bluelight text-white px-6 py-2.5 rounded-xl font-semibold text-[1.3em]"
          >
            Add First Method
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <PaymentMethodCard
              key={template.id}
              template={template}
              onEdit={openEditModal}
              onDelete={handleDeleteClick}
              onToggleActive={() => handleToggleActive(template.id)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <PaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTemplate(null);
        }}
        onSubmit={handleSubmit}
        editingTemplate={editingTemplate}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeletingTemplate(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Payment Method?"
        description={`Are you sure you want to delete "${deletingTemplate?.name}"? Users will no longer be able to use this payment method.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}
