"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialLoginButtons from "@/app/components/SocialLoginButtons";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      showError("আপনার নাম লিখুন।");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showError("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      showError("পাসওয়ার্ড ৮ থেকে ১২৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      showError("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: cleanName,
        email: cleanEmail,
        password,
      });

      if (error) {
        showError(error.message || "রেজিস্ট্রেশন করা যায়নি।");
        return;
      }

      toast.success("রেজিস্ট্রেশন সম্পন্ন হয়েছে। সাইন ইন করুন।");
      router.push("/signin");
    } catch {
      showError("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 min-h-10 w-full rounded-lg border border-[#1d271f]/10 bg-[#fafcfa] px-3 py-2 text-sm text-[#1d271f] outline-none transition placeholder:text-[#1d271f]/35 focus:border-[#05893e] focus:ring-2 focus:ring-[#05893e]/10 disabled:opacity-60";

  const labelClass =
    "text-sm font-medium text-[#1d271f]";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-[416px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold leading-8 text-[#1d271f]">
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#1d271f]/60">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
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
              <label htmlFor="name" className={labelClass}>
                নাম
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="আপনার নাম লিখুন"
                disabled={loading}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
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
              <label htmlFor="password" className={labelClass}>
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="কমপক্ষে ৮ অক্ষর"
                disabled={loading}
                required
                minLength={8}
                maxLength={128}
                aria-describedby="password-hint"
                className={inputClass}
              />

              <p
                id="password-hint"
                className="mt-1 text-xs text-[#1d271f]/60"
              >
                পাসওয়ার্ড ৮ থেকে ১২৮ অক্ষরের হতে হবে।
              </p>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className={labelClass}
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>

              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="আবার পাসওয়ার্ড লিখুন"
                disabled={loading}
                required
                maxLength={128}
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

              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ"}
            </button>
          </form>

          <SocialLoginButtons />

          <p className="mt-4 text-center text-sm text-[#1d271f]/70">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="font-medium text-[#05893e] hover:underline"
            >
              সাইন ইন করুন
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