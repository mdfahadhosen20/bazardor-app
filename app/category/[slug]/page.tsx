"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { categories } from "../../data/categories";
import ProductCard, { type Product } from "../../components/ProductCard";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor";

const gridClass =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";

const bnNumber = new Intl.NumberFormat("bn-BD");

type SortOption = "default" | "asc" | "desc";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((item) => item.slug === slug);

  const [result, setResult] = useState<{
    slug: string;
    products: Product[];
    error: boolean;
  } | null>(null);

  const [sort, setSort] = useState<{
    slug: string;
    value: SortOption;
  }>({ slug, value: "default" });

  const [attempt, setAttempt] = useState(0);

  const loading = result?.slug !== slug;
  const products = result?.slug === slug ? result.products : [];
  const error = result?.slug === slug && result.error;
  const currentSort = sort.slug === slug ? sort.value : "default";

  useEffect(() => {
    if (!category) return;

    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch(
          `${API_URL}/products?category=${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
            signal: AbortSignal.timeout(10000),
          },
        );

        if (!response.ok) {
          throw new Error("পণ্য আনা যায়নি");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("ডেটার ফরম্যাট সঠিক নয়");
        }

        if (!cancelled) {
          setResult({
            slug,
            products: data.filter(
              (product: Product) => product.category === slug,
            ),
            error: false,
          });
        }
      } catch {
        if (!cancelled) {
          setResult({ slug, products: [], error: true });
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [slug, category, attempt]);

  function retry() {
    setResult(null);
    setAttempt((previous) => previous + 1);
  }

  const sortedProducts = [...products];

  if (currentSort === "asc") {
    sortedProducts.sort((a, b) => a.today - b.today);
  } else if (currentSort === "desc") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  if (!category || (!loading && !error && products.length === 0)) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-20 text-center">
        <p className="text-6xl font-bold text-[#05893e]">৪০৪</p>

        <h1 className="mt-6 text-2xl font-bold text-[#1d271f]">
          এই বিভাগে কোনো পণ্য পাওয়া যায়নি
        </h1>

        <p className="mt-3 text-sm text-[#1d271f]/60">
          অন্য কোনো বিভাগ দেখুন অথবা হোম পেজে ফিরে যান।
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-[#05893e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          হোম পেজে ফিরে যান
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold leading-8 text-[#1d271f]">
            <span aria-hidden="true">{category.icon}</span>
            {category.nameBn}
          </h1>

          <p className="mt-2 text-sm text-[#1d271f]/70">
            এই বিভাগের পণ্যগুলোর আজকের বাজারদর দেখুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="price-sort"
            className="shrink-0 text-sm font-medium text-[#1d271f]/70"
          >
            সাজান:
          </label>

          <div className="relative">
            <select
              id="price-sort"
              value={currentSort}
              onChange={(event) =>
                setSort({
                  slug,
                  value: event.target.value as SortOption,
                })
              }
              className="min-h-10 appearance-none rounded-lg border border-[#1d271f]/15 bg-[#fafcfa] py-2 pl-3 pr-9 text-sm text-[#1d271f] outline-none focus:border-[#05893e] focus:ring-2 focus:ring-[#05893e]/10"
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>

            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1d271f]/60"
            >
              <path
                d="m5 7.5 5 5 5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          role="status"
          aria-label="পণ্য লোড হচ্ছে"
          className={`mt-6 ${gridClass}`}
        >
          <span className="sr-only">পণ্য লোড হচ্ছে...</span>

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

              <div className="mt-4 flex justify-between">
                <div className="h-6 w-24 rounded bg-gray-200" />
                <div className="h-6 w-16 rounded-full bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
        >
          <p className="text-sm text-red-700">
            পণ্য লোড করা যায়নি। আবার চেষ্টা করুন।
          </p>

          <button
            type="button"
            onClick={retry}
            className="mt-4 rounded-lg bg-[#05893e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-[#1d271f]/60">
            মোট {bnNumber.format(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>

          <div className={`mt-4 ${gridClass}`}>
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}