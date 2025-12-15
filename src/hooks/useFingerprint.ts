import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const useFingerprint = () => {
  const [visitorId, setVisitorId] = useState<string | null>(null);

  useEffect(() => {
    const getFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setVisitorId(result.visitorId);
      } catch (error) {
        console.error("Failed to get fingerprint:", error);
      }
    };

    getFingerprint();
  }, []);

  return { visitorId };
};
