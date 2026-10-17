"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownId = useId();

  const { data: session, isPending, error, refetch } =
    authClient.useSession();

  const [signingOut, setSigningOut] = useState(false);
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [failedImage, setFailedImage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const open = openPath === pathname;

  const buttonClass =
    "inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05893e] sm:px-4 sm:text-sm";

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setOpenPath(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPath(null);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      setOpenPath(null);
      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <div
        role="status"
        aria-label="অ্যাকাউন্টের তথ্য লোড হচ্ছে"
        className="h-9 w-28 animate-pulse rounded-lg bg-[#05893e]/10"
      />
    );
  }

  if (error) {
    return (
      <button
        type="button"
        onClick={() => refetch()}
        className={`${buttonClass} border border-[#1d271f]/15 text-[#1d271f] hover:bg-[#05893e]/5`}
      >
        অ্যাকাউন্ট আবার লোড করুন
      </button>
    );
  }

  if (session) {
    const name = session.user.name || "ব্যবহারকারী";
    const firstName = name.trim().split(/\s+/)[0];
    const initial = Array.from(name.trim())[0] || "U";
    const image = session.user.image;

    return (
      <div
        ref={containerRef}
        className="relative"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setOpenPath(null);
          }
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={open ? dropdownId : undefined}
          aria-label={`${name}-এর অ্যাকাউন্টের অপশন`}
          onClick={() => setOpenPath(open ? null : pathname)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-[#1d271f] transition hover:bg-[#f0f5f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05893e]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#05893e]/10 font-bold text-[#05893e]">
            {image && failedImage !== image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                width={32}
                height={32}
                referrerPolicy="no-referrer"
                onError={() => setFailedImage(image)}
                className="h-full w-full object-cover"
              />
            ) : (
              initial
            )}
          </span>

          <span className="max-w-24 truncate sm:max-w-36">
            {firstName}
          </span>

          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={`h-3.5 w-3.5 transition ${
              open ? "rotate-180" : ""
            }`}
          >
            <path
              d="m5 7.5 5 5 5-5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <div
            id={dropdownId}
            className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#1d271f]/10 bg-[#fafcfa] shadow-lg"
          >
            <div className="border-b border-[#1d271f]/10 px-4 py-3">
              <p className="break-words text-sm font-semibold text-[#1d271f]">
                {name}
              </p>

              <p className="mt-1 break-all text-xs text-[#1d271f]/60">
                {session.user.email}
              </p>
            </div>

            <div className="p-1.5">
              <Link
                href="/profile"
                onClick={() => setOpenPath(null)}
                className="block rounded-lg px-3 py-2 text-sm text-[#1d271f] transition hover:bg-[#f0f5f0] focus-visible:outline-2 focus-visible:outline-[#05893e]"
              >
                আমার প্রোফাইল
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#d03739] transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-[#d03739] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {signingOut ? "সাইন আউট হচ্ছে..." : "← সাইন আউট"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/signin"
        className={`${buttonClass} border border-[#1d271f]/15 text-[#1d271f] hover:bg-[#05893e]/5`}
      >
        সাইন ইন
      </Link>

      <Link
        href="/signup"
        className={`${buttonClass} border border-transparent bg-[#05893e] text-[#f3fbf4] hover:bg-emerald-800`}
      >
        সাইন আপ
      </Link>
    </div>
  );
}