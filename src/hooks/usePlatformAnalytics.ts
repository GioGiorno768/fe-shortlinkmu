import { useState, useEffect } from "react";

export interface PlatformAnalyticsStats {
  totalUsers: number;
  totalUsersGrowth: number; // percentage
  activeUsers: number; // last 30 days
  activeUsersGrowth: number;
  totalLinks: number;
  totalLinksGrowth: number;
  totalClicks: number;
  totalClicksGrowth: number;
}

export function usePlatformAnalytics() {
  const [stats, setStats] = useState<PlatformAnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        setStats({
          totalUsers: 12547,
          totalUsersGrowth: 12.5,
          activeUsers: 8432, // last 30 days
          activeUsersGrowth: 8.3,
          totalLinks: 45623,
          totalLinksGrowth: 15.2,
          totalClicks: 1245789,
          totalClicksGrowth: 23.7,
        });
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return {
    stats,
    isLoading,
  };
}
