"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import { Pencil, UserCircle2 } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

export default function ProfileHeader({
  setIsEditing,
}: {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div
      className="rounded-2xl border border-white/5 bg-[#111317]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
      data-testid="profile-header"
    >
      <div className="flex flex-col items-center gap-6 p-6 md:flex-row">
        <div
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10"
          data-testid="profile-avatar"
        >
          {user?.image ? (
            <Image
              src={user.image}
              alt={`${user.name}'s profile`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserCircle2 className="h-10 w-10 text-white/40" aria-hidden />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-1 text-center md:text-left">
          <h2
            className="text-xl font-semibold leading-tight tracking-tight text-white"
            data-testid="profile-name"
          >
            {user?.name ?? "—"}
          </h2>
          <p
            className="font-mono text-xs text-white/50"
            data-testid="profile-email"
          >
            {user?.email}
          </p>
        </div>

        <Button
          onClick={() => setIsEditing(true)}
          aria-label="Edit profile"
          data-testid="edit-profile-btn"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-blue-500 px-5 text-sm font-medium text-white shadow-none transition-colors hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          <Pencil className="h-4 w-4" aria-hidden />
          Edit profile
        </Button>
      </div>
    </div>
  );
}
