import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import UpdateProfileForm from "@/app/components/UpdateProfileForm";

export const runtime = "nodejs";

export default async function UpdateProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?reason=login-required");
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-[736px]">
        <h1 className="text-2xl font-bold leading-8 text-[#1d271f]">
          প্রোফাইল আপডেট
        </h1>

        <p className="mt-1 text-sm leading-6 text-[#1d271f]/60">
          আপনার নাম, ফোন নম্বর ও ঠিকানা পরিবর্তন করুন।
        </p>

        <section
          aria-label="প্রোফাইলের তথ্য পরিবর্তন"
          className="mt-6 rounded-2xl border border-[#1d271f]/10 bg-[#fafcfa] p-5 sm:p-6"
        >
          <UpdateProfileForm
            initialName={session.user.name}
            initialPhone={session.user.phone}
            initialAddress={session.user.address}
          />
        </section>

        <div className="mt-6 text-center">
          <Link
            href="/profile"
            className="text-sm text-[#1d271f]/60 transition hover:text-[#05893e]"
          >
            ← প্রোফাইলে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}