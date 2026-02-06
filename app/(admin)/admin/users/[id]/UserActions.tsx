"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  currentPlan: string;
  currentRole: string;
}

export function UserActions({ userId, currentPlan, currentRole }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSubscription = async (plan: "free" | "pro") => {
    if (currentPlan === plan) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subscription");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (role: "user" | "admin") => {
    if (currentRole === role) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-neutral-700 mb-2">
          Change Subscription Plan
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => updateSubscription("free")}
            disabled={loading || currentPlan === "free"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPlan === "free"
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Free
          </button>
          <button
            onClick={() => updateSubscription("pro")}
            disabled={loading || currentPlan === "pro"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPlan === "pro"
                ? "bg-green-200 text-green-700 cursor-not-allowed"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Pro
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-neutral-700 mb-2">
          Change User Role
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => updateRole("user")}
            disabled={loading || currentRole === "user"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentRole === "user"
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            User
          </button>
          <button
            onClick={() => updateRole("admin")}
            disabled={loading || currentRole === "admin"}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentRole === "admin"
                ? "bg-purple-200 text-purple-700 cursor-not-allowed"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-neutral-500">Updating...</p>
      )}
    </div>
  );
}
