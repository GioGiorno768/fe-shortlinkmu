import { WithdrawalDetail } from "@/types/type";
import clsx from "clsx";

interface Props {
  history: WithdrawalDetail["history"];
}

export default function WithdrawalHistoryTab({ history }: Props) {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-grays text-[0.9em]">
            <th className="py-3 px-4 font-medium">Date</th>
            <th className="py-3 px-4 font-medium">Amount</th>
            <th className="py-3 px-4 font-medium">Method</th>
            <th className="py-3 px-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="text-[0.95em]">
          {history.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-50 last:border-0 hover:bg-slate-50"
            >
              <td className="py-3 px-4 text-grays">{formatDate(item.date)}</td>
              <td className="py-3 px-4 font-bold text-shortblack">
                ${item.amount}
              </td>
              <td className="py-3 px-4 text-shortblack">{item.method}</td>
              <td className="py-3 px-4">
                <span
                  className={clsx(
                    "px-2 py-1 rounded text-[0.85em] font-bold capitalize",
                    item.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : item.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  )}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
          {history.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-grays">
                No history available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
