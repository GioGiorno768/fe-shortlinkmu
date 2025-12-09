// Service untuk revenue/financial management (Super Admin)

export interface RevenueStats {
  totalRevenue: number;
  paidWithdrawals: number;
  pendingWithdrawals: number;
  platformBalance: number;
  totalUsers: number;
  activeUsers: number;
}

export interface TopEarner {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalEarnings: number;
  withdrawalCount: number;
  status: "active" | "suspicious" | "banned";
  lastWithdrawal: Date;
}

export interface RevenueByLevel {
  levelId: string;
  levelName: string;
  totalRevenue: number;
  userCount: number;
  percentage: number;
  color: string;
}

export interface WithdrawalTrend {
  month: string;
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}

// Mock Data
const mockRevenueStats: RevenueStats = {
  totalRevenue: 125630.5,
  paidWithdrawals: 87420.25,
  pendingWithdrawals: 15230.75,
  platformBalance: 22979.5, // totalRevenue - paidWithdrawals - pendingWithdrawals
  totalUsers: 2847,
  activeUsers: 1923,
};

const mockTopEarners: TopEarner[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    totalEarnings: 8450.5,
    withdrawalCount: 12,
    status: "active",
    lastWithdrawal: new Date("2024-12-01"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    totalEarnings: 7230.25,
    withdrawalCount: 10,
    status: "active",
    lastWithdrawal: new Date("2024-12-05"),
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    totalEarnings: 6180.75,
    withdrawalCount: 15,
    status: "suspicious",
    lastWithdrawal: new Date("2024-12-08"),
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    avatar: "https://i.pravatar.cc/150?img=4",
    totalEarnings: 5940.0,
    withdrawalCount: 8,
    status: "active",
    lastWithdrawal: new Date("2024-11-28"),
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    totalEarnings: 5120.5,
    withdrawalCount: 11,
    status: "active",
    lastWithdrawal: new Date("2024-12-03"),
  },
  {
    id: "6",
    name: "David Lee",
    email: "david@example.com",
    avatar: "https://i.pravatar.cc/150?img=6",
    totalEarnings: 4850.25,
    withdrawalCount: 9,
    status: "active",
    lastWithdrawal: new Date("2024-12-07"),
  },
  {
    id: "7",
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "https://i.pravatar.cc/150?img=7",
    totalEarnings: 4620.0,
    withdrawalCount: 7,
    status: "active",
    lastWithdrawal: new Date("2024-11-30"),
  },
  {
    id: "8",
    name: "Frank Miller",
    email: "frank@example.com",
    avatar: "https://i.pravatar.cc/150?img=8",
    totalEarnings: 4350.75,
    withdrawalCount: 13,
    status: "suspicious",
    lastWithdrawal: new Date("2024-12-06"),
  },
  {
    id: "9",
    name: "Grace Taylor",
    email: "grace@example.com",
    avatar: "https://i.pravatar.cc/150?img=9",
    totalEarnings: 4120.5,
    withdrawalCount: 6,
    status: "active",
    lastWithdrawal: new Date("2024-12-02"),
  },
  {
    id: "10",
    name: "Henry Clark",
    email: "henry@example.com",
    avatar: "https://i.pravatar.cc/150?img=10",
    totalEarnings: 3890.25,
    withdrawalCount: 10,
    status: "active",
    lastWithdrawal: new Date("2024-12-04"),
  },
];

const mockRevenueByLevel: RevenueByLevel[] = [
  {
    levelId: "1",
    levelName: "Low",
    totalRevenue: 18750.5,
    userCount: 850,
    percentage: 14.9,
    color: "#10b981", // green
  },
  {
    levelId: "2",
    levelName: "Medium",
    totalRevenue: 52680.25,
    userCount: 1240,
    percentage: 41.9,
    color: "#3b82f6", // blue
  },
  {
    levelId: "3",
    levelName: "High",
    totalRevenue: 38420.75,
    userCount: 580,
    percentage: 30.6,
    color: "#f97316", // orange
  },
  {
    levelId: "4",
    levelName: "Extreme",
    totalRevenue: 15779.0,
    userCount: 177,
    percentage: 12.6,
    color: "#ef4444", // red
  },
];

const mockWithdrawalTrends: WithdrawalTrend[] = [
  {
    month: "Jun",
    total: 45230,
    approved: 42150,
    rejected: 1580,
    pending: 1500,
  },
  {
    month: "Jul",
    total: 52180,
    approved: 49320,
    rejected: 1360,
    pending: 1500,
  },
  {
    month: "Aug",
    total: 48920,
    approved: 46280,
    rejected: 1140,
    pending: 1500,
  },
  {
    month: "Sep",
    total: 56340,
    approved: 53120,
    rejected: 1720,
    pending: 1500,
  },
  {
    month: "Oct",
    total: 61250,
    approved: 57890,
    rejected: 1860,
    pending: 1500,
  },
  {
    month: "Nov",
    total: 58730,
    approved: 55240,
    rejected: 1990,
    pending: 1500,
  },
];

// Service Functions
export const getRevenueStats = async (): Promise<RevenueStats> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockRevenueStats;
};

export const getTopEarners = async (
  limit: number = 10
): Promise<TopEarner[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockTopEarners.slice(0, limit);
};

export const getRevenueByAdLevel = async (): Promise<RevenueByLevel[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockRevenueByLevel;
};

export const getWithdrawalTrends = async (
  months: number = 6
): Promise<WithdrawalTrend[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockWithdrawalTrends.slice(-months);
};

// Utility Functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};
