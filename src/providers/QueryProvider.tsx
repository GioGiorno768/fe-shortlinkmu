// src/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { setQueryClient } from "@/utils/cacheUtils";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 🔧 Industry standard: 5 minutes stale time for dashboard data
            staleTime: 5 * 60 * 1000,
            // Keep data in cache for 10 minutes (even if stale)
            gcTime: 10 * 60 * 1000,
            // Retry failed requests 2 times
            retry: 2,
            // Disable auto-refetch to improve perceived performance
            refetchOnWindowFocus: false,
            refetchOnMount: false, // Use cached data on mount
            refetchOnReconnect: false,
          },
        },
      })
  );

  // Register queryClient with cacheUtils for clearing on logout
  useEffect(() => {
    setQueryClient(queryClient);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
