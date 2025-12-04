import type { AbuseReport, AdminReportStats, ReportStatus } from "@/types/type";

// MOCK DATA
const MOCK_REPORTS: AbuseReport[] = Array.from({ length: 15 }, (_, i) => ({
  id: `rep-${i}`,
  targetLink: {
    id: `link-${i}`,
    shortUrl: `short.link/bad-${i}`,
    originalUrl: `https://free-money-scam.com/claim/${i}`,
    owner: `spammer_${i}`,
  },
  reporter: {
    ip: `192.168.1.${i}`,
    name: i % 3 === 0 ? `User Lapor ${i}` : undefined,
  },
  reason: i % 4 === 0 ? "phishing" : i % 3 === 0 ? "adult" : "spam",
  description:
    i % 4 === 0
      ? "Link ini minta password gmail saya, tolong cek!"
      : "Banyak iklan pop-up tidak senonoh.",
  status: i < 5 ? "pending" : "resolved",
  date: new Date(Date.now() - i * 3600000).toISOString(),
}));

export async function getReports(
  filter: string = "all",
  page: number = 1
): Promise<{ data: AbuseReport[]; totalPages: number }> {
  await new Promise((r) => setTimeout(r, 600));

  let filtered = [...MOCK_REPORTS];

  if (filter === "pending") {
    filtered = filtered.filter((r) => r.status === "pending");
  } else if (filter === "resolved") {
    filtered = filtered.filter(
      (r) => r.status === "resolved" || r.status === "ignored"
    );
  }

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const data = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return { data, totalPages: totalPages || 1 };
}

export async function getReportStats(): Promise<AdminReportStats> {
  await new Promise((r) => setTimeout(r, 500));
  return {
    pendingCount: 5,
    resolvedToday: 12,
    totalReports: 145,
  };
}

// Action: Block Link (Sekaligus Resolve Report)
export async function blockLinkFromReport(
  reportId: string,
  linkId: string
): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 800));
  console.log(`Blocking link ${linkId} from report ${reportId}`);
  return true;
}

// Action: Ignore Report
export async function ignoreReport(reportId: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 600));
  console.log(`Ignoring report ${reportId}`);
  return true;
}

// Action: Mark Resolved (Tanpa Block)
export async function resolveReport(reportId: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 600));
  console.log(`Resolving report ${reportId}`);
  return true;
}
