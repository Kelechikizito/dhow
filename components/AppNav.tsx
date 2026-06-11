"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useWorkspace } from "./CorridorProvider";
import { DhowMark } from "./DhowMark";

const TABS = [
  { href: "/send", label: "Send" },
  { href: "/corridor", label: "Corridor Record" },
  { href: "/capital", label: "Capital" },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { business, score, isSample, signOut, enterSample } = useWorkspace();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = (business?.name ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <DhowMark className="h-6 w-6 text-teal" />
            <span className="font-display text-lg font-medium tracking-tight">Dhow</span>
          </Link>

          <nav className="ml-2 flex items-center gap-1">
            {TABS.map((t) => {
              const active = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                    active ? "bg-ink text-paper" : "text-ink-2 hover:bg-surface-sunk"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative ml-auto flex items-center gap-3" ref={menuRef}>
            <span className="hidden tnum font-mono text-xs text-ink-3 sm:inline">
              Score {score.score}
            </span>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 transition-colors hover:border-line-strong"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-tint text-xs font-semibold text-teal-deep">
                {initials}
              </span>
              <span className="hidden text-sm text-ink sm:inline">{business?.name}</span>
              <Chevron />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-lg">
                <div className="border-b border-line px-4 py-3">
                  <p className="font-medium">{business?.name}</p>
                  <p className="text-xs text-ink-3">{business?.email}</p>
                  {business?.walletAddress && (
                    <p className="tnum mt-1 font-mono text-xs text-ink-faint">
                      {business.walletAddress}
                    </p>
                  )}
                </div>
                {isSample ? (
                  <>
                    <MenuItem
                      onClick={() => {
                        enterSample();
                        setMenuOpen(false);
                        router.push("/corridor");
                      }}
                    >
                      Reset sample data
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        signOut();
                        router.push("/onboarding");
                      }}
                    >
                      Start your own →
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem
                    onClick={() => {
                      signOut();
                      router.push("/");
                    }}
                  >
                    Sign out
                  </MenuItem>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {isSample && (
        <div className="border-b border-brass/30 bg-brass-tint/60">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-2 text-sm">
            <span className="text-brass-deep">
              You&apos;re exploring sample data as Al Noor Trading.
            </span>
            <button
              onClick={() => {
                signOut();
                router.push("/onboarding");
              }}
              className="shrink-0 font-medium text-brass-deep underline underline-offset-2"
            >
              Set up your business →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function MenuItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2.5 text-left text-sm text-ink-2 transition-colors hover:bg-surface-sunk"
    >
      {children}
    </button>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink-faint" fill="none">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
