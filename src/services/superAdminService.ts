// Mock data khusus Super Admin
export async function getSuperAdminStats() {
  await new Promise((r) => setTimeout(r, 500));
  return {
    totalAdmins: 5,
    serverStatus: "Healthy",
    totalRevenue: 5000000,
    systemLogs: 120,
  };
}
