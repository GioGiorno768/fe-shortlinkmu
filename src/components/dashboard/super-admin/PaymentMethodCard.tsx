"use client";

import { motion } from "motion/react";
import {
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Wallet,
  Building2,
  Bitcoin,
  Phone,
  Mail,
  CreditCard,
  KeyRound,
} from "lucide-react";
import clsx from "clsx";
import type { PaymentMethodTemplate } from "@/services/paymentTemplateAdminService";
import { formatAmount } from "@/services/paymentTemplateAdminService";

interface PaymentMethodCardProps {
  template: PaymentMethodTemplate;
  onEdit: (template: PaymentMethodTemplate) => void;
  onDelete: (template: PaymentMethodTemplate) => void;
  onToggleActive: (template: PaymentMethodTemplate) => void;
  index: number;
}

const getTypeConfig = (type: string) => {
  switch (type) {
    case "wallet":
      return {
        icon: Wallet,
        label: "Digital Wallet",
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
      };
    case "bank":
      return {
        icon: Building2,
        label: "Bank",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      };
    case "crypto":
      return {
        icon: Bitcoin,
        label: "Crypto",
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
      };
    default:
      return {
        icon: CreditCard,
        label: type,
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
      };
  }
};

const getInputTypeIcon = (inputType: string) => {
  switch (inputType) {
    case "phone":
      return Phone;
    case "email":
      return Mail;
    case "account_number":
      return CreditCard;
    case "crypto_address":
      return KeyRound;
    default:
      return CreditCard;
  }
};

export default function PaymentMethodCard({
  template,
  onEdit,
  onDelete,
  onToggleActive,
  index,
}: PaymentMethodCardProps) {
  const typeConfig = getTypeConfig(template.type);
  const TypeIcon = typeConfig.icon;
  const InputIcon = getInputTypeIcon(template.input_type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={clsx(
        "relative bg-white rounded-2xl p-5 border-2 transition-all duration-300",
        template.is_active
          ? "border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1"
          : "border-gray-200 bg-gray-50 opacity-70"
      )}
    >
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => onToggleActive(template)}
          className={clsx(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[1.1em] font-medium transition-all",
            template.is_active
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-200 text-gray-500 hover:bg-gray-300"
          )}
        >
          {template.is_active ? (
            <>
              <ToggleRight className="w-4 h-4" />
              Active
            </>
          ) : (
            <>
              <ToggleLeft className="w-4 h-4" />
              Inactive
            </>
          )}
        </button>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            typeConfig.bg
          )}
        >
          <TypeIcon className={clsx("w-6 h-6", typeConfig.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[1.6em] font-bold text-shortblack truncate">
            {template.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={clsx(
                "px-2 py-0.5 rounded-md text-[1em] font-medium",
                typeConfig.bg,
                typeConfig.text
              )}
            >
              {typeConfig.label}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[1em] font-semibold">
              {template.currency}
            </span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="space-y-2 mb-4">
        {/* Input Type */}
        <div className="flex items-center gap-2 text-[1.2em] text-grays">
          <InputIcon className="w-4 h-4 text-gray-400" />
          <span className="text-shortblack font-medium">
            {template.input_label}
          </span>
        </div>

        {/* Fee */}
        <div className="flex items-center justify-between text-[1.2em]">
          <span className="text-grays">Fee</span>
          <span className="text-shortblack font-semibold">
            ${Number(template.fee).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(template)}
          className="flex-1 py-2 px-3 rounded-xl bg-bluelight text-white font-semibold text-[1.2em] hover:bg-opacity-90 transition-all flex items-center justify-center gap-1.5"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(template)}
          className="py-2 px-3 rounded-xl bg-red-50 text-red-600 font-semibold text-[1.2em] hover:bg-red-100 transition-all border border-red-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
