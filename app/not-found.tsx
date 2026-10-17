import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20 text-center">
      <p className="text-6xl font-bold text-emerald-600">
        ৪০৪
      </p>

      <h1 className="mt-6 text-2xl font-bold">
        পেজটি খুঁজে পাওয়া যায়নি
      </h1>

      <p className="mt-3 text-gray-500">
        লিংকটি ভুল হতে পারে অথবা পেজটি আর নেই।
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
      >
        হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}