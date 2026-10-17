"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ToastProvider() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const url = new URL(window.location.href);
    const reason = url.searchParams.get("reason");
    const authStatus = url.searchParams.get("auth");

    let handled = false;

    if (pathname === "/signin" && reason === "login-required") {
      toast.error("এই পেজ দেখতে আগে সাইন ইন করুন।", {
        id: "login-required",
      });

      url.searchParams.delete("reason");
      handled = true;
    } else if (pathname === "/signin" && reason === "social-error") {
      toast.error("সোশ্যাল লগইন সম্পন্ন হয়নি। আবার চেষ্টা করুন।", {
        id: "social-error",
      });

      url.searchParams.delete("reason");
      url.searchParams.delete("error");
      url.searchParams.delete("error_description");
      handled = true;
    }

    if (
      pathname === "/" &&
      authStatus === "social-success" &&
      !isPending &&
      session
    ) {
      toast.success("সফলভাবে সাইন ইন হয়েছে।", {
        id: "social-success",
      });

      url.searchParams.delete("auth");
      handled = true;
    }

    if (handled) {
      window.history.replaceState(
        window.history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`
      );
    }
  }, [pathname, session, isPending]);

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "var(--font-bengali), sans-serif",
        },
      }}
    />
  );
}