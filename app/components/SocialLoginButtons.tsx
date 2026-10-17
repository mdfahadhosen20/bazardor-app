"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type Provider = "google" | "github";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H3.06v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.92A6 6 0 0 1 6.09 12c0-.67.11-1.32.31-1.92V7.49H3.06A10 10 0 0 0 2 12c0 1.61.38 3.14 1.06 4.51l3.34-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.96c1.47 0 2.79.5 3.82 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.94 5.49l3.34 2.59c.79-2.36 3-4.12 5.6-4.12Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
    >
      <path d="M12 .75a11.25 11.25 0 0 0-3.558 21.923c.563.104.768-.244.768-.542 0-.267-.01-.974-.015-1.912-3.13.68-3.79-1.508-3.79-1.508-.512-1.3-1.25-1.646-1.25-1.646-1.022-.699.077-.685.077-.685 1.13.08 1.724 1.16 1.724 1.16 1.005 1.723 2.637 1.225 3.28.937.102-.728.394-1.225.716-1.507-2.498-.284-5.124-1.249-5.124-5.56 0-1.229.439-2.233 1.16-3.02-.116-.284-.503-1.428.11-2.977 0 0 .945-.303 3.094 1.153A10.79 10.79 0 0 1 12 6.19c.956.005 1.918.129 2.817.379 2.148-1.456 3.091-1.153 3.091-1.153.615 1.549.228 2.693.112 2.977.723.787 1.159 1.791 1.159 3.02 0 4.322-2.63 5.273-5.136 5.552.404.349.765 1.037.765 2.09 0 1.509-.014 2.726-.014 3.096 0 .3.203.65.774.54A11.25 11.25 0 0 0 12 .75Z" />
    </svg>
  );
}

export default function SocialLoginButtons() {
  const [loadingProvider, setLoadingProvider] =
    useState<Provider | null>(null);

  async function handleSocialLogin(provider: Provider) {
    if (loadingProvider) return;

    setLoadingProvider(provider);

    const providerName = provider === "google" ? "Google" : "GitHub";

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/?auth=social-success",
        errorCallbackURL: "/signin?reason=social-error",
      });

      if (result.error) {
        toast.error(
          result.error.message ||
            `${providerName} দিয়ে লগইন করা যায়নি।`,
        );
        setLoadingProvider(null);
      }
    } catch {
      toast.error("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setLoadingProvider(null);
    }
  }

  return (
    <div className="mt-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#1d271f]/10" />
        <span className="text-xs text-[#1d271f]/60">অথবা</span>
        <div className="h-px flex-1 bg-[#1d271f]/10" />
      </div>

      <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
        {(["google", "github"] as const).map((provider) => {
          const providerName =
            provider === "google" ? "Google" : "GitHub";

          const loading = loadingProvider === provider;

          return (
            <button
              key={provider}
              type="button"
              onClick={() => handleSocialLogin(provider)}
              disabled={loadingProvider !== null}
              aria-busy={loading}
              className="flex min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#1d271f]/10 bg-[#fafcfa] px-2 py-2 text-xs font-semibold text-[#1d271f] transition hover:border-[#05893e]/30 hover:bg-[#f0f5f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05893e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#05893e]/20 border-t-[#05893e]"
                />
              ) : provider === "google" ? (
                <GoogleIcon />
              ) : (
                <GitHubIcon />
              )}

              <span>
                {loading
                  ? `${providerName}-এ যাচ্ছে...`
                  : `${providerName} দিয়ে চালিয়ে যান`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}