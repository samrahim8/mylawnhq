"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  trigger?: string; // What triggered the gate (e.g., "save your plan", "use AI chat")
}

export function CreateAccountModal({ isOpen, onClose, onSuccess, trigger }: CreateAccountModalProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get guest data from localStorage
  const guestData = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("lawnhq_guest") || "{}")
    : {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!guestData.email) {
      setError("No email found. Please start over.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: guestData.email,
        password,
        options: {
          data: {
            zip_code: guestData.zipCode,
            grass_type: guestData.grassType,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          // Try to sign in
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: guestData.email,
            password,
          });

          if (signInError) {
            setError("Account exists with different password. Try logging in.");
            setLoading(false);
            return;
          }
        } else {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
      }

      // Clear guest data, keep profile
      localStorage.removeItem("lawnhq_guest");

      onSuccess();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/home`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-deep-brown/40 hover:text-deep-brown"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-lawn/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-lawn" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-deep-brown">
            Save your progress
          </h2>
          <p className="mt-2 text-deep-brown/60 text-sm">
            {trigger
              ? `Create a password to ${trigger}`
              : "Create a password to save your lawn plan and access it anytime"
            }
          </p>
        </div>

        {guestData.email && (
          <div className="bg-cream/50 rounded-lg px-4 py-3 mb-4 text-sm">
            <span className="text-deep-brown/60">Saving as: </span>
            <span className="font-medium text-deep-brown">{guestData.email}</span>
          </div>
        )}

        {/* Google option */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-deep-brown/15 text-deep-brown font-medium py-3 rounded-xl hover:bg-cream/50 transition-colors disabled:opacity-50 mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-deep-brown/10" />
          <span className="text-xs text-deep-brown/40">or set a password</span>
          <div className="flex-1 h-px bg-deep-brown/10" />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Create a password (6+ characters)"
            className="w-full px-4 py-3 rounded-xl border border-deep-brown/15 bg-cream/30 text-deep-brown placeholder:text-deep-brown/40 focus:outline-none focus:ring-2 focus:ring-lawn/30 focus:border-lawn/30"
          />

          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || password.length < 6}
            className="mt-4 w-full bg-lawn text-white font-semibold py-3.5 rounded-xl hover:bg-lawn/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </>
            ) : (
              "Save My Progress"
            )}
          </button>
        </form>

        <p className="mt-4 text-xs text-deep-brown/40 text-center">
          We&apos;ll never share your email or spam you.
        </p>
      </div>
    </div>
  );
}
