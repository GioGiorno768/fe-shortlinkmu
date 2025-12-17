import { Loader2 } from "lucide-react";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-bluelight" />
    </div>
  );
}
