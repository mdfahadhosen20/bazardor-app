import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1d271f]/10 bg-[#fafcfa]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded text-base font-bold text-[#05893e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#05893e]"
          >
            <Image
              src="/logo-icon.png"
              alt=""
              width={18}
              height={18}
            />
            বাজার দর
          </Link>

          <p className="mt-1 text-xs leading-5 text-[#1d271f]/60">
            প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
        </div>

        <p className="max-w-md text-xs leading-5 text-[#1d271f]/60 sm:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}