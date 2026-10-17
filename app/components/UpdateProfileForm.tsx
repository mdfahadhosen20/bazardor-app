"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type Props = {
  initialName: string;
  initialPhone?: string | null;
  initialAddress?: string | null;
};

export default function UpdateProfileForm({
  initialName,
  initialPhone,
  initialAddress,
}: Props) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [address, setAddress] = useState(initialAddress ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function showError(message: string) {
    setError(message);
    toast.error(message);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");

    const updatedName = name.trim();
    const updatedAddress = address.trim();

    const updatedPhone = phone
      .trim()
      .replace(/[০-৯]/g, (digit) =>
        String("০১২৩৪৫৬৭৮৯".indexOf(digit)),
      )
      .replace(/[\s()-]/g, "");

    if (!updatedName) {
      showError("আপনার নাম লিখুন।");
      return;
    }

    if (updatedName.length > 100) {
      showError("নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারবে।");
      return;
    }

    if (
      updatedPhone &&
      !/^(?:\+88|88)?01[3-9]\d{8}$/.test(updatedPhone)
    ) {
      showError("সঠিক বাংলাদেশি মোবাইল নম্বর লিখুন।");
      return;
    }

    if (updatedAddress.length > 300) {
      showError("ঠিকানা সর্বোচ্চ ৩০০ অক্ষরের হতে পারবে।");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.updateUser({
        name: updatedName,
        phone: updatedPhone,
        address: updatedAddress,
      });

      if (result.error) {
        showError(
          result.error.message || "তথ্য আপডেট করা যায়নি।",
        );
        return;
      }

      toast.success("আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে।");
      router.replace("/profile");
      router.refresh();
    } catch {
      showError("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 min-h-10 w-full rounded-lg border border-[#1d271f]/10 bg-[#fafcfa] px-3 py-2 text-sm text-[#1d271f] outline-none transition placeholder:text-[#1d271f]/35 focus:border-[#05893e] focus:ring-2 focus:ring-[#05893e]/10 disabled:opacity-60";

  const labelClass = "text-sm font-medium text-[#1d271f]";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={loading}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-name" className={labelClass}>
            নাম
          </label>

          <input
            id="profile-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={loading}
            maxLength={100}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="profile-phone" className={labelClass}>
            ফোন নম্বর
            <span className="ml-2 text-xs text-[#1d271f]/60">
              (ঐচ্ছিক)
            </span>
          </label>

          <input
            id="profile-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="01XXXXXXXXX"
            disabled={loading}
            maxLength={25}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="profile-address" className={labelClass}>
          ঠিকানা
          <span className="ml-2 text-xs text-[#1d271f]/60">
            (ঐচ্ছিক)
          </span>
        </label>

        <textarea
          id="profile-address"
          name="address"
          autoComplete="street-address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="আপনার ঠিকানা লিখুন"
          disabled={loading}
          maxLength={300}
          rows={3}
          aria-describedby="profile-details-hint"
          className={`${inputClass} resize-y`}
        />

        <p
          id="profile-details-hint"
          className="mt-1 text-xs text-[#1d271f]/60"
        >
          ফোন নম্বর ও ঠিকানা চাইলে খালি রাখতে পারেন।
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
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

        {loading ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
      </button>
    </form>
  );
}