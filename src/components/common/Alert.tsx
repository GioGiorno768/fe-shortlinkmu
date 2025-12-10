// Alert Component - Card style error/success message
import { motion } from "motion/react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

interface AlertProps {
  type?: "error" | "success" | "info";
  message: string;
  onClose?: () => void;
  className?: string;
}

export default function Alert({
  type = "error",
  message,
  onClose,
  className = "",
}: AlertProps) {
  const typeStyles = {
    error: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-700",
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
    success: {
      bg: "bg-green-50 border-green-200",
      text: "text-green-700",
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      icon: Info,
      iconColor: "text-blue-500",
    },
  };

  const style = typeStyles[type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${style.bg} border ${style.text} px-[2em] py-[1.5em] rounded-2xl flex items-start gap-[1em] ${className} z-[1000] relative text-shortblack`}
    >
      <Icon className={`w-5 h-5 ${style.iconColor} shrink-0 mt-[0.2em]`} />
      <p className="flex-1 text-[1.4em] font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
