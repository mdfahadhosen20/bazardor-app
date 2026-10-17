"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialLoginButtons from "@/app/components/SocialLoginButtons";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function showError(message: string) {
    setErrorMessage(message);
    toast.error(message);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setErrorMessage("");

    const cleanEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showError("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }

    if (!password) {
      showError("পাসওয়ার্ড লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: cleanEmail,
        password,
      });

      if (error) {
        showError(error.message || "সাইন ইন করা যায়নি।");
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে।");
      router.replace("/");
      router.refresh();
    } catch {
      showError("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 min-h-10 w-full rounded-lg border border-[#1d271f]/10 bg-[#fafcfa] px-3 py-2 text-sm text-[#1d271f] outline-none transition placeholder:text-[#1d271f]/35 focus:border-[#05893e] focus:ring-2 focus:ring-[#05893e]/10 disabled:opacity-60";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-[416px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold leading-8 text-[#1d271f]">
            সাইন ইন
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#1d271f]/60">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে
            অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-[#1d271f]/10 bg-[#fafcfa] p-5 sm:p-6">
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-busy={loading}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-[#1d271f]"
              >
                ইমেইল
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#1d271f]"
              >
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                disabled={loading}
                required
                className={inputClass}
              />
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#05893e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05893e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              )}

              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          <SocialLoginButtons />

          <p className="mt-4 text-center text-sm text-[#1d271f]/70">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#05893e] hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[#1d271f]/60 transition hover:text-[#05893e]"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}