import {
  CreditCard,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { WithdrawalDetail } from "@/types/type";
import clsx from "clsx";

interface Props {
  data: WithdrawalDetail;
}

export default function TransactionInfoCard({ data }: Props) {
  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2 });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-[1.1em] font-bold text-shortblack">
            Payment Details
          </h3>
          <p className="text-grays text-[0.9em]">
            Transaction ID:{" "}
            <span className="font-mono text-shortblack">#{data.id}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Amount Breakdown */}
        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
          <div className="flex justify-between text-[1.1em]">
            <span className="text-grays">Requested Amount</span>
            <span className="font-bold text-shortblack">
              {formatCurrency(data.amount)}
            </span>
          </div>
          <div className="flex justify-between text-[1.1em]">
            <span className="text-grays">Fee</span>
            <span className="font-bold text-red-500">
              -{formatCurrency(data.fee)}
            </span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-between text-[1.2em]">
            <span className="font-bold text-shortblack">Net Amount</span>
            <span className="font-bold text-green-600">
              {formatCurrency(data.netAmount)}
            </span>
          </div>
        </div>

        {/* Method Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-100 rounded-xl">
            <p className="text-grays text-[0.9em] mb-1 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment Method
            </p>
            <p className="font-bold text-shortblack text-[1.1em]">
              {data.method}
            </p>
          </div>
          <div className="p-4 border border-gray-100 rounded-xl">
            <p className="text-grays text-[0.9em] mb-1 flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4" /> Account Number
            </p>
            <p className="font-bold text-shortblack text-[1.1em] break-all">
              {data.accountNumber}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-grays text-[0.95em]">
          <Calendar className="w-4 h-4" />
          Created on {formatDate(data.date)}
        </div>
      </div>
    </div>
  );
}
