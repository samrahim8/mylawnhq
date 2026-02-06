import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface DashboardStats {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  trialingUsers: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalAiChats: number;
  totalPhotoDiagnoses: number;
}

async function getStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  // Get user counts by plan
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("plan, status, billing_interval");

  const totalUsers = subscriptions?.length || 0;
  const proUsers = subscriptions?.filter(s => s.plan === "pro" && s.status === "active").length || 0;
  const trialingUsers = subscriptions?.filter(s => s.status === "trialing").length || 0;
  const freeUsers = totalUsers - proUsers - trialingUsers;

  // Calculate MRR (Monthly Recurring Revenue)
  const monthlyPro = subscriptions?.filter(s => s.plan === "pro" && s.billing_interval === "month").length || 0;
  const yearlyPro = subscriptions?.filter(s => s.plan === "pro" && s.billing_interval === "year").length || 0;
  const monthlyRevenue = monthlyPro * 10;
  const yearlyRevenue = (yearlyPro * 88) / 12; // Spread yearly over months

  // Get current month usage totals
  const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
  const { data: usage } = await supabase
    .from("usage")
    .select("ai_chat_count, photo_diagnosis_count")
    .gte("period_start", currentMonth);

  const totalAiChats = usage?.reduce((sum, u) => sum + (u.ai_chat_count || 0), 0) || 0;
  const totalPhotoDiagnoses = usage?.reduce((sum, u) => sum + (u.photo_diagnosis_count || 0), 0) || 0;

  return {
    totalUsers,
    proUsers,
    freeUsers,
    trialingUsers,
    monthlyRevenue,
    yearlyRevenue,
    totalAiChats,
    totalPhotoDiagnoses,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
          <Link
            href="/home"
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            Back to App
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            color="bg-blue-500"
          />
          <StatCard
            label="Pro Users"
            value={stats.proUsers}
            color="bg-green-500"
          />
          <StatCard
            label="Free Users"
            value={stats.freeUsers}
            color="bg-gray-500"
          />
          <StatCard
            label="Trialing"
            value={stats.trialingUsers}
            color="bg-yellow-500"
          />
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Revenue</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-500">Monthly MRR</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats.monthlyRevenue.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Annual (Monthly Equiv)</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats.yearlyRevenue.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-neutral-500">Total MRR</p>
            <p className="text-3xl font-bold text-green-600">
              ${(stats.monthlyRevenue + stats.yearlyRevenue).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Usage This Month */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Usage This Month
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-500">AI Chat Messages</p>
              <p className="text-2xl font-bold text-neutral-900">
                {stats.totalAiChats.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Photo Diagnoses</p>
              <p className="text-2xl font-bold text-neutral-900">
                {stats.totalPhotoDiagnoses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Quick Links
          </h2>
          <div className="space-y-2">
            <Link
              href="/admin/users"
              className="block p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              <span className="font-medium">Manage Users</span>
              <span className="text-sm text-neutral-500 block">
                View all users, edit profiles, manage subscriptions
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className={`w-3 h-3 rounded-full ${color} mb-2`} />
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
    </div>
  );
}
