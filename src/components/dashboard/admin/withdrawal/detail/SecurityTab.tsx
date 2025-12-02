import { WithdrawalDetail } from "@/types/type";
import { ShieldAlert, Globe, Monitor, MapPin } from "lucide-react";
import clsx from "clsx";

interface Props {
  fraudInfo: WithdrawalDetail["fraudInfo"];
}

export default function SecurityTab({ fraudInfo }: Props) {
  return (
    <div className="space-y-6">
      {/* Risk Score Banner */}
      <div
        className={clsx(
          "p-4 rounded-xl border flex items-start gap-3",
          fraudInfo.riskScore === "high"
            ? "bg-red-50 border-red-100 text-red-700"
            : fraudInfo.riskScore === "medium"
            ? "bg-yellow-50 border-yellow-100 text-yellow-700"
            : "bg-green-50 border-green-100 text-green-700"
        )}
      >
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-[1.1em] capitalize">
            Risk Score: {fraudInfo.riskScore}
          </h4>
          <p className="text-[0.9em] opacity-90 mt-1">
            {fraudInfo.riskScore === "safe"
              ? "No suspicious activity detected for this transaction."
              : "Potential fraud indicators found. Please review carefully."}
          </p>
        </div>
      </div>

      {/* Technical Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 text-grays mb-2">
            <Globe className="w-4 h-4" />
            <span className="text-[0.9em]">IP Address</span>
          </div>
          <p className="font-mono font-bold text-shortblack">
            {fraudInfo.ipAddress}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 text-grays mb-2">
            <Monitor className="w-4 h-4" />
            <span className="text-[0.9em]">Device</span>
          </div>
          <p className="font-bold text-shortblack">{fraudInfo.device}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 text-grays mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-[0.9em]">Location</span>
          </div>
          <p className="font-bold text-shortblack">{fraudInfo.location}</p>
        </div>
      </div>

      {/* Risk Factors */}
      {fraudInfo.riskFactors.length > 0 && (
        <div>
          <h4 className="font-bold text-shortblack mb-3">Risk Factors</h4>
          <ul className="space-y-2">
            {fraudInfo.riskFactors.map((factor, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg text-[0.95em]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
