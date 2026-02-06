import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface User {
  id: string;
  email: string | null;
  zip_code: string | null;
  grass_type: string | null;
  role: string;
  created_at: string;
  subscription?: {
    plan: string;
    status: string;
    billing_interval: string | null;
  };
  usage?: {
    ai_chat_count: number;
    photo_diagnosis_count: number;
  };
}

async function getUsers(): Promise<User[]> {
  const supabase = await createClient();

  // Get all profiles with their subscriptions
  const { data: profiles } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      zip_code,
      grass_type,
      role,
      created_at,
      subscriptions (
        plan,
        status,
        billing_interval
      )
    `)
    .order("created_at", { ascending: false });

  if (!profiles) return [];

  // Get current month usage
  const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
  const { data: usageData } = await supabase
    .from("usage")
    .select("user_id, ai_chat_count, photo_diagnosis_count")
    .gte("period_start", currentMonth);

  const usageMap = new Map(
    usageData?.map(u => [u.user_id, {
      ai_chat_count: u.ai_chat_count || 0,
      photo_diagnosis_count: u.photo_diagnosis_count || 0,
    }]) || []
  );

  return profiles.map(p => ({
    id: p.id,
    email: p.email,
    zip_code: p.zip_code,
    grass_type: p.grass_type,
    role: p.role,
    created_at: p.created_at,
    subscription: Array.isArray(p.subscriptions) ? p.subscriptions[0] : p.subscriptions,
    usage: usageMap.get(p.id),
  }));
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/admin"
              className="text-sm text-neutral-500 hover:text-neutral-700 mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-neutral-900">Users</h1>
          </div>
          <p className="text-neutral-500">{users.length} total users</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-neutral-500">
                  Email
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-500">
                  Plan
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-500">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-500">
                  Usage (Chat/Photo)
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-500">
                  Joined
                </th>
                <th className="text-left p-4 text-sm font-medium text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-neutral-50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-neutral-900">
                        {user.email || "No email"}
                      </p>
                      {user.zip_code && (
                        <p className="text-sm text-neutral-500">
                          {user.zip_code} • {user.grass_type || "No grass type"}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <PlanBadge plan={user.subscription?.plan || "free"} />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={user.subscription?.status || "active"} />
                  </td>
                  <td className="p-4 text-neutral-600">
                    {user.usage?.ai_chat_count || 0} / {user.usage?.photo_diagnosis_count || 0}
                  </td>
                  <td className="p-4 text-neutral-500 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const colors = {
    pro: "bg-green-100 text-green-800",
    free: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[plan as keyof typeof colors] || colors.free}`}>
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    active: "bg-green-100 text-green-800",
    trialing: "bg-yellow-100 text-yellow-800",
    past_due: "bg-red-100 text-red-800",
    canceled: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || colors.active}`}>
      {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
    </span>
  );
}
