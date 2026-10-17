import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { units } from "@/lib/product-units";

export const runtime = "nodejs";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type ProductDetails = {
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
  markets: Market[];
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);
}

async function fetchFromApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
  }

  return (await response.json()) as T;
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?reason=login-required");
  }

  const { slug } = await params;

  let product: ProductDetails | null = null;
  let fetchFailed = false;

  try {
    const products = await fetchFromApi<ProductDetails[]>("/products");

    if (!Array.isArray(products)) {
      throw new Error("পণ্যের তালিকার ফরম্যাট সঠিক নয়।");
    }

    const selectedProduct = products.find((item) => item.slug === slug);

    if (selectedProduct) {
      product = await fetchFromApi<ProductDetails>(
        `/products/${selectedProduct.id}`,
      );
    }
  } catch {
    fetchFailed = true;
  }

  if (fetchFailed) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <section className="rounded-2xl border border-[#1d271f]/10 bg-[#fafcfa] p-8 text-center">
          <h1 className="text-xl font-bold text-[#1d271f]">
            পণ্যের তথ্য লোড করা যায়নি
          </h1>

          <p className="mt-3 text-sm text-[#1d271f]/60">
            কিছুক্ষণ পর আবার চেষ্টা করুন।
          </p>

          <a
            href={`/product/${encodeURIComponent(slug)}`}
            className="mt-6 inline-block rounded-lg bg-[#05893e] px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            আবার চেষ্টা করুন
          </a>
        </section>
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  const markets = Array.isArray(product.markets) ? product.markets : [];
  const unit = units[product.unit] ?? product.unit;
  const unitLabel = `প্রতি ${unit}`;

  const minimumPrice = markets.length
    ? Math.min(...markets.map((market) => market.min))
    : null;

  const maximumPrice = markets.length
    ? Math.max(...markets.map((market) => market.max))
    : null;

  const averagePrice = markets.length
    ? markets.reduce(
        (total, market) => total + (market.min + market.max) / 2,
        0,
      ) / markets.length
    : null;

  const difference = product.today - product.yesterday;
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  const changeClass = isUp
    ? "text-[#05893e]"
    : isDown
      ? "text-[#d03739]"
      : "text-[#1d271f]/60";

  const changeSymbol = isUp ? "▲" : isDown ? "▼" : "—";

  const changePercent = new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(Math.abs(product.change.pct));

  const priceSummary = [
    {
      label: "সর্বনিম্ন দাম",
      value: minimumPrice,
      description: "সবচেয়ে কম দামের বাজার",
    },
    {
      label: "সর্বাধিক দাম",
      value: maximumPrice,
      description: "সবচেয়ে বেশি দামের বাজার",
    },
    {
      label: "গড় দাম",
      value: averagePrice,
      description: `${unitLabel}-এর হিসাবে`,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 text-[#1d271f]">
      <nav aria-label="পেজের অবস্থান">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-[#1d271f]/60">
          <li>
            <Link href="/" className="hover:text-[#05893e]">
              হোম
            </Link>
          </li>

          <li aria-hidden="true">›</li>

          <li>
            <Link
              href={`/category/${product.category}`}
              className="hover:text-[#05893e]"
            >
              {product.categoryNameBn}
            </Link>
          </li>

          <li aria-hidden="true">›</li>

          <li aria-current="page" className="text-[#1d271f]">
            {product.nameBn}
          </li>
        </ol>
      </nav>

      <section className="rounded-2xl border border-[#1d271f]/10 bg-[#fafcfa] p-5">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div
              aria-hidden="true"
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#f0f5f0] text-4xl"
            >
              {product.image}
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold leading-8">
                {product.nameBn}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#1d271f]/60">
                <span>{unitLabel}</span>
                <span aria-hidden="true">·</span>

                <Link
                  href={`/category/${product.category}`}
                  className="hover:text-[#05893e] hover:underline"
                >
                  {product.categoryNameBn}
                </Link>
              </div>

              <p className="mt-2 text-sm leading-6 text-[#1d271f]/70">
                {difference === 0 ? (
                  "গতকালের তুলনায় আজ দাম অপরিবর্তিত।"
                ) : (
                  <>
                    গতকালের তুলনায় আজ দাম{" "}
                    {difference > 0 ? "বেড়েছে" : "কমেছে"} ·{" "}
                    <span className="price-number">
                      {formatNumber(Math.abs(difference))}
                    </span>{" "}
                    টাকা
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="border-t border-[#1d271f]/10 pt-4 md:border-t-0 md:pt-0 md:text-right">
            <p className="text-xs text-[#1d271f]/60">
              আজকের দাম
            </p>

            <p className="price-number mt-1 text-3xl font-bold leading-10">
              {formatNumber(product.today)}
            </p>

            <p className="text-xs text-[#1d271f]/60">
              টাকা / {unit}
            </p>

            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-full bg-[#f0f5f0] px-3 py-1 text-xs font-semibold ${changeClass}`}
            >
              <span aria-hidden="true">{changeSymbol}</span>
              <span className="price-number">{changePercent}%</span>
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#1d271f]/10 bg-[#fafcfa] p-4 sm:p-5">
        <h2 className="text-xl font-bold">দামের সারসংক্ষেপ</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {priceSummary.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#1d271f]/10 p-4"
            >
              <p className="text-xs text-[#1d271f]/60">
                {item.label}
              </p>

              <p className="mt-1 text-xl font-bold">
                {item.value === null ? (
                  "তথ্য নেই"
                ) : (
                  <>
                    <span className="price-number">
                      {formatNumber(item.value)}
                    </span>{" "}
                    টাকা
                  </>
                )}
              </p>

              <p className="mt-1 text-xs text-[#1d271f]/60">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <h2 className="mt-6 text-xl font-bold">
          বাজারভিত্তিক আজকের দাম
        </h2>

        {markets.length === 0 ? (
          <p className="mt-4 text-sm text-[#1d271f]/60">
            এই পণ্যের বাজারভিত্তিক দাম পাওয়া যায়নি।
          </p>
        ) : (
          <>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#1d271f]/10">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm [&_th]:border [&_th]:border-[#1d271f]/20 [&_td]:border [&_td]:border-[#1d271f]/20 [&_tbody_tr:nth-child(even)]:bg-[#f0f5f0]">
                <caption className="sr-only">
                  {product.nameBn}-এর বাজারভিত্তিক মূল্যতালিকা,
                  {unitLabel}
                </caption>

                <thead className="bg-[#f0f5f0] text-[#1d271f]/70">
                  <tr>
                    {["বাজার", "বিভাগ", "সর্বনিম্ন", "সর্বাধিক", "গড়"].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="whitespace-nowrap px-4 py-3 font-semibold"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#1d271f]/10">
                  {markets.map((market, index) => (
                    <tr
                      key={`${market.division}-${market.market}-${index}`}
                      className="transition hover:bg-[#f0f5f0]"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium"
                      >
                        {market.market}
                      </th>

                      <td className="px-4 py-3 text-[#1d271f]/70">
                        {market.division}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="price-number">
                          {formatNumber(market.min)}
                        </span>{" "}
                        টাকা
                      </td>

                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="price-number">
                          {formatNumber(market.max)}
                        </span>{" "}
                        টাকা
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 font-semibold">
                        <span className="price-number">
                          {formatNumber((market.min + market.max) / 2)}
                        </span>{" "}
                        টাকা
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#1d271f]/60">
              প্রতিটি বাজারের গড় তার সর্বনিম্ন ও সর্বাধিক দামের
              মধ্যমান। সারসংক্ষেপের গড় সব বাজারের মধ্যমানের গড়।
            </p>
          </>
        )}
      </section>
    </main>
  );
}