"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useAdLevels } from "@/hooks/useAdLevels";
import { useAlert } from "@/hooks/useAlert";
import AdLevelCard from "@/components/dashboard/super-admin/AdLevelCard";
import AdLevelModal from "@/components/dashboard/super-admin/AdLevelModal";
import ConfirmationModal from "@/components/dashboard/ConfirmationModal";
import GlobalAlert from "@/components/dashboard/GlobalAlert";
import type { AdLevelConfig } from "@/services/adLevelService";

export default function AdsConfigurationPage() {
  const {
    levels,
    isLoading,
    isSubmitting,
    handleCreate,
    handleUpdate,
    handleDelete,
    getNextLevelNumber,
  } = useAdLevels();

  const { showAlert } = useAlert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<AdLevelConfig | null>(null);

  // Confirmation modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingLevel, setDeletingLevel] = useState<AdLevelConfig | null>(
    null
  );

  // Default level state (stored in localStorage)
  const [defaultLevelId, setDefaultLevelId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("defaultAdLevelId");
    }
    return null;
  });

  // Pending default confirmation
  const [isDefaultConfirmOpen, setIsDefaultConfirmOpen] = useState(false);
  const [pendingDefaultLevel, setPendingDefaultLevel] =
    useState<AdLevelConfig | null>(null);

  const openCreateModal = () => {
    setEditingLevel(null);
    setIsModalOpen(true);
  };

  const openEditModal = (level: AdLevelConfig) => {
    setEditingLevel(level);
    setIsModalOpen(true);
  };

  const handleSubmit = async (
    data: Omit<AdLevelConfig, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingLevel) {
      await handleUpdate(editingLevel.id, data);
    } else {
      await handleCreate(data);
    }
  };

  const handleDeleteClick = (level: AdLevelConfig) => {
    setDeletingLevel(level);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingLevel) {
      await handleDelete(deletingLevel.id);
      setIsConfirmOpen(false);
      setDeletingLevel(null);
    }
  };

  const handleSetDefault = (level: AdLevelConfig) => {
    setPendingDefaultLevel(level);
    setIsDefaultConfirmOpen(true);
  };

  const confirmSetDefault = () => {
    if (pendingDefaultLevel) {
      setDefaultLevelId(pendingDefaultLevel.id);
      if (typeof window !== "undefined") {
        localStorage.setItem("defaultAdLevelId", pendingDefaultLevel.id);
      }

      // Show success alert
      showAlert(
        `"${pendingDefaultLevel.name}" has been set as the default ad level for new shortlinks.`,
        "success",
        "Default Ad Level Set!"
      );

      setIsDefaultConfirmOpen(false);
      setPendingDefaultLevel(null);
    }
  };

  return (
    <div className="space-y-8 pb-10 font-figtree text-[10px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[2.4em] font-bold text-shortblack">
            Ads Configuration
          </h1>
          <p className="text-gray-400 text-[1.4em]">
            Manage ad levels, CPC rates, and features for user monetization
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-shortblack text-white px-6 py-3 rounded-xl font-semibold text-[1.4em] hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add New Level
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin text-bluelight" />
        </div>
      ) : (
        <>
          {/* Empty State */}
          {levels.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                  <Plus className="w-10 h-10 text-bluelight" />
                </div>
                <h2 className="text-[2em] font-bold text-shortblack">
                  No Ad Levels Yet
                </h2>
                <p className="text-grays text-[1.4em]">
                  Create your first ad level to start configuring monetization
                  options for users
                </p>
                <button
                  onClick={openCreateModal}
                  className="mt-4 bg-bluelight text-white px-6 py-3 rounded-xl font-semibold text-[1.4em] hover:bg-opacity-90 transition-all"
                >
                  Create First Level
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-[1.3em] text-blue-800">
                  <strong>Note:</strong> CPC (Cost Per Click) is what you
                  configure here. Users will see CPM (Cost Per Mille = CPC ×
                  1000) on their dashboard.
                </p>
              </div>

              {/* Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-5">
                {levels.map((level, index) => (
                  <AdLevelCard
                    key={level.id}
                    level={level}
                    onEdit={openEditModal}
                    onDelete={handleDeleteClick}
                    onSetDefault={handleSetDefault}
                    isDefault={level.id === defaultLevelId}
                    index={index}
                  />
                ))}
              </div>

              {/* Stats Summary */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-[1.6em] font-bold text-shortblack mb-4">
                  Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-[2.5em] font-bold text-bluelight">
                      {levels.length}
                    </p>
                    <p className="text-[1.2em] text-grays">Total Levels</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-[2.5em] font-bold text-green-600">
                      {levels.filter((l) => l.isPopular).length}
                    </p>
                    <p className="text-[1.2em] text-grays">Popular</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <p className="text-[2.5em] font-bold text-orange-600">
                      {Math.min(...levels.map((l) => l.revenueShare))}%-
                      {Math.max(...levels.map((l) => l.revenueShare))}%
                    </p>
                    <p className="text-[1.2em] text-grays">Revenue Range</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <p className="text-[2.5em] font-bold text-purple-600">
                      ${Math.min(...levels.map((l) => l.cpcRate)).toFixed(4)}
                    </p>
                    <p className="text-[1.2em] text-grays">Min CPC</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Modal */}
      <AdLevelModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLevel(null);
        }}
        onSubmit={handleSubmit}
        editingLevel={editingLevel}
        nextLevelNumber={getNextLevelNumber()}
        isSubmitting={isSubmitting}
      />

      {/* Set Default Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDefaultConfirmOpen}
        onClose={() => {
          setIsDefaultConfirmOpen(false);
          setPendingDefaultLevel(null);
        }}
        onConfirm={confirmSetDefault}
        title="Set as Default Ad Level?"
        description={`Set "${pendingDefaultLevel?.name}" as the default ad level for all new shortlinks?`}
        confirmLabel="Set as Default"
        cancelLabel="Cancel"
        type="info"
        isLoading={false}
      />
      {/* Global Alert for notifications */}
      <GlobalAlert />
    </div>
  );
}
