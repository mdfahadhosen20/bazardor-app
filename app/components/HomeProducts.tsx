"use client";

import { useEffect, useState } from "react";
import ProductCard, { type Product } from "./ProductCard";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor";

const gridClass =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

const bnNumber = new Intl.NumberFormat("bn-BD");

function ProductSkeletons() {
  return (
    <div
      role="status"
      aria-label="পণ্যের তথ্য লোড হচ্ছে"
      className={gridClass}
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="min-h-[138px] animate-pulse rounded-2xl border border-[#1d271f]/10 bg-[#fafcfa] p-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-[#05893e]/10" />

            <div className="flex-1">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="h-6 w-28 rounded bg-gray-200" />
            <div className="h-6 w-16 rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomeProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/products`, {
          cache: "no-store",
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          throw new Error("Could not load products.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response.");
        }

        if (!cancelled) {
          setProducts(data);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort(
      (a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct),
    )
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort(
      (a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct),
    )
    .slice(0, 6);

  const sections = [
    {
      id: "দাম-বেড়েছে",
      title: "আজ দাম বেড়েছে",
      symbol: "▲",
      symbolClass: "text-[#05893e]",
      subtitle: "",
      items: risers,
      emptyMessage: "আজ দাম বেড়েছে এমন কোনো পণ্য পাওয়া যায়নি।",
    },
    {
      id: "দাম-কমেছে",
      title: "আজ দাম কমেছে",
      symbol: "▼",
      symbolClass: "text-red-600",
      subtitle: "",
      items: fallers,
      emptyMessage: "আজ দাম কমেছে এমন কোনো পণ্য পাওয়া যায়নি।",
    },
    {
      id: "সব-পণ্য",
      title: "সব পণ্য",
      symbol: "",
      symbolClass: "",
      subtitle: loading
        ? "প্রয়োজনীয় সব পণ্যের আজকের দাম দেখুন।"
        : error
          ? ""
          : `মোট ${bnNumber.format(products.length)}টি পণ্য দেখানো হচ্ছে`,
      items: products,
      emptyMessage: "এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।",
    },
  ];

  return (
    <div className="mt-10 space-y-10">
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-100 bg-red-50 p-5"
        >
          <p className="text-sm text-red-700">
            পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।
          </p>

          <button
            type="button"
            onClick={() => {
              setError(false);
              setLoading(true);
              setAttempt((value) => value + 1);
            }}
            className="mt-3 rounded-lg bg-[#05893e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-6"
        >
          <h2 className="flex items-center gap-2 text-xl font-bold leading-7 text-[#1d271f]">
            {section.symbol && (
              <span
                aria-hidden="true"
                className={`text-sm ${section.symbolClass}`}
              >
                {section.symbol}
              </span>
            )}

            {section.title}
          </h2>

          {section.subtitle && (
            <p className="mt-3 text-sm text-[#1d271f]/70">
              {section.subtitle}
            </p>
          )}

          <div className="mt-5">
            {loading ? (
              <ProductSkeletons />
            ) : error ? (
              <p className="text-sm text-[#1d271f]/60">
                পণ্যের তথ্য পাওয়া যাচ্ছে না।
              </p>
            ) : section.items.length === 0 ? (
              <p className="rounded-2xl border border-[#1d271f]/10 bg-[#fafcfa] p-6 text-sm text-[#1d271f]/60">
                {section.emptyMessage}
              </p>
            ) : (
              <div className={gridClass}>
                {section.items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}