"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { units } from "@/lib/product-units";

type TickerProduct = {
  id: number;
  slug: string;
  nameBn: string;
  image: string;
  unit: string;
  today: number;
  change: {
    dir: string;
    pct: number;
  };
};

const apiUrls = [
  "https://openapi.programming-hero.com/api/bazardor",
];

const bnNumber = new Intl.NumberFormat("bn-BD");

export default function PriceTicker() {
  const [products, setProducts] = useState<TickerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      for (const baseUrl of apiUrls) {
        try {
          const response = await fetch(`${baseUrl}/products`, {
            signal: AbortSignal.timeout(10000),
          });

          if (!response.ok) {
            throw new Error("Products could not be loaded.");
          }

          const data = await response.json();

          if (!Array.isArray(data)) {
            throw new Error("Unexpected API response.");
          }

          if (!cancelled) {
            setProducts(data);
            setLoading(false);
          }

          return;
        } catch {
          // প্রথম API ব্যর্থ হলে পরেরটি চেষ্টা করবে।
        }
      }

      if (!cancelled) {
        setError(true);
        setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-2">
        <div className="mx-auto h-5 max-w-6xl animate-pulse rounded bg-emerald-100" />
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div
        role="status"
        className="bg-emerald-50 px-4 py-2 text-center text-xs text-gray-600"
      >
        {error
          ? "দামের তথ্য এই মুহূর্তে লোড করা যাচ্ছে না।"
          : "দামের তথ্য পাওয়া যায়নি।"}
      </div>
    );
  }

  return (
    <div
      aria-label="আজকের পণ্যের দাম"
      className="ticker overflow-hidden border-b border-emerald-100 bg-emerald-50"
    >
      <div className="ticker-track flex w-max">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center"
          >
            {products.map((product) => {
              const direction = product.change.dir;

              const arrow =
                direction === "up"
                  ? "▲"
                  : direction === "down"
                    ? "▼"
                    : "—";

              const changeColor =
                direction === "up"
                  ? "text-emerald-700"
                  : direction === "down"
                    ? "text-red-600"
                    : "text-gray-500";

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  prefetch={false}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="flex items-center gap-2 whitespace-nowrap px-6 py-2 text-sm transition hover:bg-emerald-100 focus-visible:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-emerald-600 focus-visible:-outline-offset-2"
                >
                  <span aria-hidden="true">{product.image}</span>
                  <span>{product.nameBn}</span>

                  <span className="font-semibold">
                    {bnNumber.format(product.today)} টাকা/
                    {units[product.unit] ?? product.unit}
                  </span>

                  <span className={changeColor}>
                    {arrow}{" "}
                    {bnNumber.format(Math.abs(product.change.pct))}%
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}