"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@/components/CorridorProvider";
import { AppNav } from "@/components/AppNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { hydrated, isAuthenticated, isOnboarded } = useAccount();

  // Gate the product behind a real account. Sample mode counts as onboarded.
  useEffect(() => {
    if (hydrated && (!isAuthenticated || !isOnboarded)) {
      router.replace("/onboarding");
    }
  }, [hydrated, isAuthenticated, isOnboarded, router]);

  if (!hydrated || !isAuthenticated || !isOnboarded) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <p className="text-sm text-ink-faint">Loading your workspace…</p>
      </main>
    );
  }

  return (
    <>
      <AppNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        {children}
      </main>
    </>
  );
}
