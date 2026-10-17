"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { authClient } from "@/lib/auth-client";

type Stats = {
  products: number;
  markets: number;
  divisions: number;
};

type ApiProduct = {
  markets: {
    market: string;
    division: string;
  }[];
};

const bnNumber = new Intl.NumberFormat("bn-BD");

const dateFormatter = new Intl.DateTimeFormat("bn-BD", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

function getToday() {
  return dateFormatter.format(new Date());
}

function getServerToday() {
  return "আজকের বাজারদর";
}

function subscribeToDate(onChange: () => void) {
  const interval = window.setInterval(onChange, 60000);

  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);

  return () => {
    window.clearInterval(interval);
    window.removeEventListener("focus", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}

export default function Hero() {
  const { data: session, isPending } = authClient.useSession();

  const today = useSyncExternalStore(
    subscribeToDate,
    getToday,
    getServerToday,
  );

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsError, setStatsError] = useState(false);

  const signedIn = Boolean(session);

  useEffect(() => {
    if (!signedIn) return;

    let cancelled = false;

    async function loadStats() {
      try {
        const response = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products",
          {
            cache: "no-store",
            signal: AbortSignal.timeout(10000),
          },
        );

        if (!response.ok) {
          throw new Error("তথ্য লোড করা যায়নি");
        }

        const data: ApiProduct[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("ডেটার ফরম্যাট সঠিক নয়");
        }

        const markets = new Set<string>();
        const divisions = new Set<string>();

        data.forEach((product) => {
          if (!Array.isArray(product.markets)) return;

          product.markets.forEach((market) => {
            markets.add(`${market.division}:${market.market}`);
            divisions.add(market.division);
          });
        });

        if (!cancelled) {
          setStats({
            products: data.length,
            markets: markets.size,
            divisions: divisions.size,
          });
          setStatsError(false);
        }
      } catch {
        if (!cancelled) {
          setStatsError(true);
        }
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  const statItems = [
    {
      label: "পণ্য",
      value: stats?.products,
      description: "টি নিত্যদিনের পণ্য",
    },
    {
      label: "বাজার",
      value: stats?.markets,
      description: "টি বাজার অন্তর্ভুক্ত",
    },
    {
      label: "বিভাগ",
      value: stats?.divisions,
      description: "টি বিভাগের তথ্য",
    },
  ];

  return (
    <section className="rounded-3xl border border-emerald-900/10 bg-[#fafcfa] p-4 sm:p-6 lg:px-4 lg:py-2">
      <div
        className={`grid gap-6 lg:grid-cols-[1.5fr_1fr] ${
          signedIn
            ? "items-start lg:min-h-[263px] lg:py-6"
            : "items-center"
        }`}
      >
        <div className="py-2">
          <p className="inline-flex min-h-7 rounded-full bg-[#05893e]/10 px-3 py-1 text-sm font-medium text-[#05893e]">
            {today}
          </p>

          <h1 className="mt-2 text-3xl font-bold leading-tight text-[#1d271f] sm:text-4xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-[#1d271f]/70 sm:text-base">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <a
              href="#সব-পণ্য"
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#05893e] px-5 py-2 text-sm font-semibold text-[#f3fbf4] transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#05893e]"
            >
              সব পণ্য দেখুন
            </a>

            {signedIn && (
              <a
                href="#সব-পণ্য"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#1d271f]/50 px-4 py-2 text-sm font-semibold text-[#1d271f] transition hover:bg-[#f0f5f0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#05893e]"
              >
                <span aria-hidden="true">⚖️</span>
                বাজার তুলনা
              </a>
            )}
          </div>
        </div>

        {isPending ? (
          <div
            role="status"
            aria-label="অ্যাকাউন্টের তথ্য লোড হচ্ছে"
            className="h-[263px] w-full animate-pulse rounded-2xl bg-[#f0f5f0]"
          />
        ) : signedIn ? (
          <div className="md:pt-2">
            <div
              aria-label="বাজারদরের তথ্যের সারসংক্ষেপ"
              className="grid grid-cols-3 divide-x divide-[#1d271f]/10 rounded-2xl border border-[#1d271f]/5 bg-[#f0f5f0] py-4"
            >
              {statItems.map((item, index) => (
                <div key={item.label} className="px-3 sm:px-4">
                  <p className="text-xs text-[#1d271f]/60">
                    {item.label}
                  </p>

                  {item.value !== undefined ? (
                    <p
                      className={`mt-2 text-2xl font-bold leading-8 ${
                        index === 0
                          ? "text-[#05893e]"
                          : "text-[#1d271f]"
                      }`}
                    >
                      {bnNumber.format(item.value)}
                    </p>
                  ) : statsError ? (
                    <p className="mt-2 text-2xl text-[#1d271f]/50">
                      —
                    </p>
                  ) : (
                    <div
                      aria-label="তথ্য লোড হচ্ছে"
                      className="mt-2 h-8 w-10 animate-pulse rounded bg-[#05893e]/10"
                    />
                  )}

                  <p className="mt-1 text-xs leading-5 text-[#1d271f]/60">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {statsError && (
              <p role="status" className="mt-2 text-xs text-red-600">
                সারসংক্ষেপের তথ্য লোড করা যায়নি।
              </p>
            )}
          </div>
        ) : (
          <div className="flex justify-center md:justify-end">
            <Image
              src="/bazar-hero.png"
              alt="নিত্যপ্রয়োজনীয় বাজারের পণ্য"
              width={315}
              height={263}
              sizes="(max-width: 767px) 80vw, 315px"
              priority
              className="h-auto w-full max-w-[315px]"
            />
          </div>
        )}
      </div>
    </section>
  );
}