"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/app/data/categories";

export default function CategoryNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", nameBn: "সব পণ্য", icon: "🛒" },
    ...categories.map((category) => ({
      href: `/category/${category.slug}`,
      nameBn: category.nameBn,
      icon: category.icon,
    })),
  ];

  return (
    <nav
      aria-label="পণ্যের বিভাগ"
      className="border-t border-[#1d271f]/10 bg-[#fafcfa]"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#05893e] ${
                  isActive
                    ? "bg-[#05893e]/10 text-[#05893e]"
                    : "text-[#1d271f]/70 hover:bg-[#05893e]/5 hover:text-[#05893e]"
                }`}
              >
                <span aria-hidden="true">{link.icon}</span>
                <span>{link.nameBn}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}