"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Video } from "lucide-react";
import AvatarDropDown from "../avatar-dropdown";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#111317]/80 backdrop-blur-xl"
      style={{ colorScheme: "dark" }}
      data-testid="app-navbar"
    >
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          aria-label="MeetFlow home"
          data-testid="nav-logo"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-white/10"
            aria-hidden
          >
            <Video className="h-5 w-5 text-blue-200" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-white">MeetFlow</span>
            <span className="text-[11px] uppercase tracking-wider text-white/50">
              Video Meetings
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav
          className="hidden items-center gap-1 rounded-full border border-white/5 bg-white/[0.04] p-1 md:flex"
          data-testid="nav-links"
        >
          {NAV.map(({ href, label }) => {
            const active =
              pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                data-testid={`nav-link-${label.toLowerCase()}`}
                className={[
                  "rounded-full px-4 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-blue-500/15 text-blue-200"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <AvatarDropDown />
        </div>
      </div>
    </header>
  );
}
