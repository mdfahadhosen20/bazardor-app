import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileSignOutButton from "@/app/components/ProfileSignOutButton";

export const runtime = "nodejs";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?reason=login-required");
  }

  const { user } = session;
  const initial = Array.from(user.name.trim())[0] || "👤";

  const details = [
    { label: "নাম", value: user.name },
    { label: "ইমেইল", value: user.email },
    { label: "ফোন নম্বর", value: user.phone || "যোগ করা হয়নি" },
    { label: "ঠিকানা", value: user.address || "যোগ করা হয়নি" },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-[736px]">
        <h1 className="text-2xl font-bold leading-8 text-[#1d271f]">
          আমার প্রোফাইল
        </h1>

        <p className="mt-1 text-sm text-[#1d271f]/60">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>

        <section
          aria-label="অ্যাকাউন্টের পরিচিতি"
          className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#1d271f]/10 bg-[#fafcfa] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#05893e]/10 text-3xl font-bold text-[#05893e]">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={`${user.name}-এর প্রোফাইল ছবি`}
                  width={80}
                  height={80}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-lg font-semibold text-[#1d271f]">
                {user.name}
              </h2>

              <p className="mt-1 break-all text-sm text-[#1d271f]/60">
                {user.email}
              </p>
            </div>
          </div>

          <ProfileSignOutButton />
        </section>

        <section className="mt-6 rounded-2xl border border-[#1d271f]/10 bg-[#fafcfa] p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-[#1d271f]">
            তথ্য
          </h2>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {details.map((item) => (
              <div
                key={item.label}
                className={item.label === "ঠিকানা" ? "sm:col-span-2" : ""}
              >
                <dt className="text-sm text-[#1d271f]/70">
                  {item.label}
                </dt>

                <dd className="mt-2 min-h-10 whitespace-pre-wrap break-words rounded-lg border border-[#1d271f]/10 px-3 py-2 text-sm font-medium text-[#1d271f] [overflow-wrap:anywhere]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="/profile/update"
            className="mt-5 flex min-h-10 w-full items-center justify-center rounded-lg bg-[#05893e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05893e]"
          >
            তথ্য আপডেট করুন
          </Link>
        </section>

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