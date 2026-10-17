import Link from "next/link";
import { units } from "@/lib/product-units";

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: string;
    pct: number;
  };
};

const priceFormatter = new Intl.NumberFormat("bn-BD");

const percentFormatter = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const direction = product.change.dir;

  const arrow =
    direction === "up"
      ? "▲"
      : direction === "down"
        ? "▼"
        : "—";

  const badgeColor =
    direction === "up"
      ? "text-[#05893e]"
      : direction === "down"
        ? "text-[#d03739]"
        : "text-[#1d271f]/60";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block h-full rounded-2xl border border-[#1d271f]/10 bg-[#fafcfa] p-4 transition hover:border-[#05893e]/40 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#05893e]"
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl"
        >
          {product.image}
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-6 text-[#1d271f]">
            {product.nameBn}
          </h3>

          <p className="text-xs leading-4 text-[#1d271f]/60">
            প্রতি {units[product.unit] ?? product.unit}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs leading-4 text-[#1d271f]/60">
            আজকের দাম
          </p>

          <p className="text-xl font-bold leading-7 text-[#1d271f]">
            {priceFormatter.format(product.today)}{" "}
            <span className="text-sm font-medium">টাকা</span>
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f0f5f0] px-2 py-1 text-xs font-semibold leading-4 ${badgeColor}`}
        >
          <span aria-hidden="true">{arrow}</span>
          <span className="sr-only">
            {direction === "up"
              ? "দাম বেড়েছে"
              : direction === "down"
                ? "দাম কমেছে"
                : "দাম অপরিবর্তিত"}
          </span>

          {percentFormatter.format(Math.abs(product.change.pct))}%
        </span>
      </div>
    </Link>
  );
}