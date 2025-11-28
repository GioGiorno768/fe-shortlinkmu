// src/app/[locale]/(member)/new-link/page.tsx
"use client";

import { useState, useEffect } from "react";
import CreateShortlink from "@/components/dashboard/CreateShortlink";
import type {
  CreateLinkFormData,
  GeneratedLinkData,
  Shortlink,
  EditableLinkData,
} from "@/types/type";
import LinkList from "@/components/dashboard/links/LinkList";

// Mock Fetch Data
async function fetchUserLinks(): Promise<Shortlink[]> {
  await new Promise((r) => setTimeout(r, 1000));
  // ... Generate array dummy (copy dari LinkList lama) ...
  return Array.from({ length: 10 }, (_, i) => ({
    id: `link-${i}`,
    title: `Link ${i}`,
    shortUrl: `short.link/${i}`,
    originalUrl: "https://google.com",
    dateCreated: new Date().toISOString(),
    validViews: 100 * i,
    totalEarning: 5 * i,
    totalClicks: 200 * i,
    averageCPM: 4.5,
    adsLevel: "level1",
    passwordProtected: false,
    status: "active",
  }));
}

export default function NewLinkPage() {
  const [links, setLinks] = useState<Shortlink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserLinks().then((data) => {
      setLinks(data);
      setLoading(false);
    });
  }, []);

  const handleUpdate = async (id: string, newData: EditableLinkData) => {
    // Update state lokal (nanti ganti API call)
    setLinks((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, ...newData, passwordProtected: !!newData.password }
          : l
      )
    );
  };

  const handleDisable = async (id: string, status: "active" | "disabled") => {
    const newStatus = status === "active" ? "disabled" : "active";
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
  };

  return (
    <div className="lg:text-[10px] text-[8px] font-figtree space-y-6">
      <CreateShortlink
        generatedLink={null}
        isLoading={false}
        error={null}
        onSubmit={async () => true}
      />

      {loading ? (
        <p className="text-center text-[1.4em]">Loading Links...</p>
      ) : (
        <LinkList
          links={links}
          onUpdateLink={handleUpdate}
          onDisableLink={handleDisable}
        />
      )}
    </div>
  );
}
