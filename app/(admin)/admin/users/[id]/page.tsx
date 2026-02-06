import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UserActions } from "./UserActions";

interface Props {
  params: Promise<{ id: string }>;
}

async function getUser(userId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      subscriptions (*)
    `)
    .eq("id", userId)
    .single();

  if (!profile) return null;

  // Get usage history
  const { data: usage } = await supabase
    .from("usage")
    .select("*")
    .eq("user_id", userId)
    .order("period_start", { ascending: false })
    .limit(6);

  return {
    ...profile,
    subscription: Array.isArray(profile.subscriptions)
      ? profile.subscriptions[0]
      : profile.subscriptions,
    usageHistory: usage || [],
  };
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/users"
          className="text-sm text-neutral-500 hover:text-neutral-700 mb-4 inline-block"
        >
          ← Back to Users
        </Link>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {user.email || "No email"}
              </h1>
              <p className="text-neutral-500 text-sm mt-1">
                User ID: {user.id}
              </p>
            </div>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.role === "admin"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Lawn Profile
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoItem label="Zip Code" value={user.zip_code} />
            <InfoItem label="Grass Type" value={user.grass_type} />
            <InfoItem label="Lawn Size" value={user.lawn_size} />
            <InfoItem label="Sun Exposure" value={user.sun_exposure} />
            <InfoItem label="Lawn Goal" value={user.lawn_goal} />
            <InfoItem label="Mower Type" value={user.mower_type} />
            <InfoItem label="Spreader Type" value={user.spreader_type} />
            <InfoItem label="Irrigation" value={user.irrigation_system} />
            <InfoItem label="Soil Type" value={user.soil_type} />
            <InfoItem label="Lawn Age" value={user.lawn_age} />
          </div>
          {user.known_issues && user.known_issues.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-neutral-500 mb-2">Known Issues</p>
              <div className="flex flex-wrap gap-2">
                {user.known_issues.map((issue: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-neutral-100 rounded text-sm"
                  >
                    {issue}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Subscription
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-neutral-500">Plan</p>
              <p className="font-medium text-neutral-900">
                {user.subscription?.plan || "Free"}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Status</p>
              <p className="font-medium text-neutral-900">
                {user.subscription?.status || "Active"}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Billing</p>
              <p className="font-medium text-neutral-900">
                {user.subscription?.billing_interval || "N/A"}
              </p>
            </div>
            {user.subscription?.current_period_end && (
              <div>
                <p className="text-sm text-neutral-500">Renews</p>
                <p className="font-medium text-neutral-900">
                  {new Date(user.subscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
            )}
            {user.subscription?.stripe_customer_id && (
              <div>
                <p className="text-sm text-neutral-500">Stripe Customer</p>
                <p className="font-mono text-sm text-neutral-600">
                  {user.subscription.stripe_customer_id}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Usage History */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Usage History
          </h2>
          {user.usageHistory.length > 0 ? (
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-2 text-sm font-medium text-neutral-500">
                    Period
                  </th>
                  <th className="text-right p-2 text-sm font-medium text-neutral-500">
                    AI Chats
                  </th>
                  <th className="text-right p-2 text-sm font-medium text-neutral-500">
                    Photo Diagnoses
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.usageHistory.map((u: {
                  id: string;
                  period_start: string;
                  ai_chat_count: number;
                  photo_diagnosis_count: number;
                }) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="p-2 text-neutral-900">
                      {new Date(u.period_start).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-2 text-right text-neutral-600">
                      {u.ai_chat_count}
                    </td>
                    <td className="p-2 text-right text-neutral-600">
                      {u.photo_diagnosis_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-neutral-500">No usage recorded yet.</p>
          )}
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Admin Actions
          </h2>
          <UserActions
            userId={user.id}
            currentPlan={user.subscription?.plan || "free"}
            currentRole={user.role}
          />
        </div>

        {/* Timestamps */}
        <div className="mt-6 text-sm text-neutral-500 text-center">
          Created: {new Date(user.created_at).toLocaleString()} •
          Updated: {new Date(user.updated_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="font-medium text-neutral-900">{value || "—"}</p>
    </div>
  );
}
