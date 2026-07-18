"use client";

import Link from "next/link";
import AvatarDropDown from "./components/avatar-dropdown";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            🎥
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight">
              MeetFlow
            </span>
            <span className="text-xs text-muted-foreground">
              Video Meetings
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/dashboard"
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Dashboard
          </Link>
        </nav>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <AvatarDropDown />
        </div>
      </div>
    </header>
  );
}
