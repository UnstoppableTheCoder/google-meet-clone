"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { Avatar } from "@repo/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
  UserCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function AvatarDropDown() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/sign-in"),
      },
    });
  };

  console.log(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          data-testid="avatar-menu-trigger"
          className="group inline-flex h-10 items-center gap-2 rounded-full bg-white/[0.04] pl-1 pr-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 md:pr-3"
        >
          <Avatar className="h-8 w-8 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Profile"}
                width={32}
                height={32}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <UserCircle2 className="h-5 w-5 text-white/40" aria-hidden />
              </div>
            )}
          </Avatar>

          <div className="hidden max-w-[140px] text-left leading-tight md:block">
            <p className="truncate text-sm text-white">{user?.name ?? "—"}</p>
            <p className="truncate font-mono text-[11px] text-white/50">
              {user?.email}
            </p>
          </div>

          <ChevronDown
            className="hidden h-4 w-4 text-white/50 transition-transform group-data-[state=open]:rotate-180 md:block"
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        data-testid="avatar-menu-content"
        className="w-72 rounded-2xl border border-white/5 bg-[#111317]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
          <Avatar className="h-11 w-11 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Profile"}
                width={44}
                height={44}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <UserCircle2 className="h-6 w-6 text-white/40" aria-hidden />
              </div>
            )}
          </Avatar>

          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-white">
              {user?.name ?? "—"}
            </p>
            <p className="truncate font-mono text-[11px] text-white/50">
              {user?.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 bg-white/5" />

        <DropdownMenuItem
          asChild
          data-testid="menu-item-profile"
          className="h-10 cursor-pointer rounded-full px-3 text-sm text-white/80 focus:bg-white/10 focus:text-white"
        >
          <Link href="/profile" className="flex items-center gap-3">
            <User className="h-4 w-4" aria-hidden />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          data-testid="menu-item-dashboard"
          className="h-10 cursor-pointer rounded-full px-3 text-sm text-white/80 focus:bg-white/10 focus:text-white"
        >
          <Link href="/dashboard" className="flex items-center gap-3">
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-white/5" />

        <DropdownMenuItem
          onClick={handleLogout}
          data-testid="menu-item-logout"
          aria-label="Log out"
          className="h-10 cursor-pointer rounded-full px-3 text-sm text-red-300 focus:bg-red-500/10 focus:text-red-200"
        >
          <LogOut className="mr-3 h-4 w-4" aria-hidden />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
