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
    <div className="bg-base-100 border border-base-300 shadow-xl">
      <div className="flex flex-col md:flex-row items-center gap-6 p-6">
        <div className="w-24 h-24 ">
          {user && (
            <Image
              src={user.profileUrl}
              alt="Profile Image"
              width={100}
              height={100}
              className="rounded-full"
            />
          )}
        </div>

        <div className="flex-1 space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-base-content">
            {user?.name}
          </h2>

          <p className="text-sm text-base-content/70">{user?.email}</p>
        </div>

        <Button className="btn btn-primary" onClick={() => setIsEditing(true)}>
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
