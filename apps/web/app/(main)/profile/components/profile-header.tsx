import { useSession } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
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
    <div className="rounded-2xl border border-border bg-card shadow-xl">
      <div className="flex flex-col items-center gap-6 p-6 md:flex-row">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background shadow-md">
          {user && (
            <Image
              src={user.image ?? ""}
              alt={`${user.name}'s profile`}
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="flex-1 space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold tracking-tight">
            {user?.name}
          </h2>

          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <Button
          onClick={() => setIsEditing(true)}
          className="h-11 rounded-xl px-6 font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
