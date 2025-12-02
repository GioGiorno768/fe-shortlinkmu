import Image from "next/image";
import { WithdrawalDetail } from "@/types/type";
import { Wallet, ShieldCheck, Mail } from "lucide-react";

interface Props {
  user: WithdrawalDetail["user"];
}

export default function UserProfileCard({ user }: Props) {
  const formatCurrency = (val: number) =>
    "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2 });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={user.avatar}
          alt={user.name}
          width={64}
          height={64}
          className="rounded-full bg-gray-100 border-2 border-white shadow-md"
        />
        <div>
          <h3 className="text-[1.2em] font-bold text-shortblack">
            {user.name}
          </h3>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 text-[0.85em] font-bold border border-purple-100">
            <ShieldCheck className="w-3 h-3" /> {user.level}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="p-2 bg-white rounded-lg shadow-sm text-grays">
            <Mail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.85em] text-grays">Email Address</p>
            <p className="font-medium text-shortblack truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
          <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[0.85em] text-blue-600/80">Wallet Balance</p>
            <p className="font-bold text-blue-700 text-[1.2em]">
              {formatCurrency(user.walletBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
