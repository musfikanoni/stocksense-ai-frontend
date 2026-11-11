// Demo data copied from the Figma admin screens. Replaced by the real API in the backend phase.
export const adminStats = [
  { label: "Total User", value: 11250, delta: "+311 user", note: "vs last month", up: true },
  { label: "Active User", value: 3541, delta: "+38 user", note: "vs previous day", up: true },
  { label: "Paid User", value: 248, delta: "+28 user", note: "vs last month", up: true },
  { label: "Blocked User", value: 214, delta: "-2 user", note: "vs last month", up: false },
];

export const planOptions = ["Free", "Premium (Monthly)", "Premium (Yearly)"] as const;
export type UserPlan = (typeof planOptions)[number];
export type AdminUser = { id: number; name: string; email: string; plan: UserPlan; joined: string; blocked: boolean };

const people = ["Jon Menson", "Aisha Rahman", "Tom Becker", "Sara Lin", "Ravi Patel", "Maya Chen", "Omar Farouk", "Lena Fischer", "Diego Alvarez", "Nadia Karim", "Ethan Brooks", "Priya Nair"];
const plansCycle: UserPlan[] = ["Premium (Monthly)", "Free", "Premium (Yearly)", "Free", "Premium (Monthly)", "Free"];
export const adminUsers: AdminUser[] = people.map((name, i) => ({
  id: i + 1, name, email: `${name.split(" ")[0].toLowerCase()}@example.com`, plan: plansCycle[i % 6],
  joined: `Jun ${10 + (i % 9)}, 2026`, blocked: i === 5 || i === 9,
}));

export type BillingRow = { tx: string; userId: number; plan: Exclude<UserPlan, "Free">; date: string; status: "Paid" | "Pending" | "Failed" };
const txs = ["pi_3Nxj8h2eZvKYlo2C0X7d5fG9", "pi_3Nxk1p2eZvKYlo2C1B9sQ3aT", "pi_3Nxm4r2eZvKYlo2C0Lw8eHc2", "pi_3Nxn7t2eZvKYlo2C1Pq5mZu6", "pi_3Nxp2v2eZvKYlo2C0Yd4kRj1", "pi_3Nxq9w2eZvKYlo2C1Hn7bVx3", "pi_3Nxr5y2eZvKYlo2C0Ta6gFd8", "pi_3Nxs3z2eZvKYlo2C1Mk2sLp4"];
const statuses: BillingRow["status"][] = ["Paid", "Paid", "Pending", "Paid", "Failed", "Paid", "Pending", "Paid"];
export const billingRows: BillingRow[] = txs.map((tx, i) => ({
  tx, userId: [1, 3, 5, 1, 4, 7, 9, 11][i], plan: i % 3 === 2 ? "Premium (Yearly)" : "Premium (Monthly)", date: `Jun ${10 + i}, 2026`, status: statuses[i],
}));

export const invoicesFor = (_userId: number) => [
  { date: "22 Dec 2026", plan: "Premium Plan", billing: "Yearly", amount: "$99.99" },
  { date: "22 Dec 2026", plan: "Premium Plan", billing: "Monthly", amount: "$9.99" },
  { date: "22 Nov 2026", plan: "Premium Plan", billing: "Monthly", amount: "$9.99" },
  { date: "22 Oct 2026", plan: "Premium Plan", billing: "Monthly", amount: "$9.99" },
];

export const adminNotifications = [
  { text: "New user registered. John Smith created a new account.", time: "8 min ago" },
  { text: "Premium subscription activated. Sarah Wilson upgraded to Premium plan.", time: "15 min ago" },
  { text: "AI Signal system updated. New market analysis data has been processed.", time: "30 min ago" },
  { text: "Payment received. $49 subscription payment completed successfully.", time: "1 hour ago" },
];
export const userNotifications = [
  { text: "AAPL reached resistance zone at $248.20.", time: "3 min ago" },
  { text: "TSLA signal turned Bullish.", time: "20 min ago" },
  { text: "Your daily market summary is ready.", time: "2 hours ago" },
];
