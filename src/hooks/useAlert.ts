import { create } from "zustand";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertState {
  isOpen: boolean;
  message: string;
  title?: string;
  type: AlertType;
  duration: number;
  showAlert: (
    message: string,
    type?: AlertType,
    title?: string,
    duration?: number
  ) => void;
  hideAlert: () => void;
}

export const useAlert = create<AlertState>((set) => ({
  isOpen: false,
  message: "",
  title: "",
  type: "info",
  duration: 3000, // Default 3 detik
  showAlert: (message, type = "info", title = "", duration = 3000) => {
    set({ isOpen: true, message, type, title, duration });
    // Otomatis tutup
    setTimeout(() => {
      set((state) => ({ ...state, isOpen: false }));
    }, duration);
  },
  hideAlert: () => set({ isOpen: false }),
}));
