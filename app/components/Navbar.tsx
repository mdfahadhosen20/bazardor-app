import Image from "next/image";
import Link from "next/link";
import CategoryNav from "./CategoryNav";
import PriceTicker from "./PriceTicker";
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  const today = new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "long",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <header className="border-b border-[#1d271f]/10 bg-[#fafcfa]">
      <div className="mx-auto flex min-h-[68px] max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#05893e]"
        >
          <div className="flex items-center gap-2">
            <Image
              src="/logo-icon.png"
              alt=""
              width={20}
              height={20}
            />

            <span className="text-xl font-bold leading-6 text-[#05893e]">
              বাজার দর
            </span>
          </div>

          <p className="mt-1 text-xs leading-4 text-[#1d271f]/60">
            {today}
          </p>
        </Link>

        <AuthButtons />
      </div>

      <CategoryNav />
      <PriceTicker />
    </header>
  );
}