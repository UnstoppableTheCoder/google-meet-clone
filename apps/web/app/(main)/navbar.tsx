"use client";

import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in"); // redirect to login page
        },
      },
    });
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-6 text-base-content space-x-5">
      {/* Left Side */}
      <div className="flex-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xl font-semibold"
        >
          🎥 MeetClone
        </Link>
      </div>

      {/* Center Navigation */}
      <div className="hidden md:flex gap-4">
        <Link href="/dashboard" className="btn btn-ghost">
          Dashboard
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Avatar Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="cursor-pointer">
            <Avatar className="w-10 h-10">
              {user && (
                <Image
                  src={user.profileUrl}
                  alt="Profile image"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              )}
            </Avatar>
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-3"
          >
            <li>
              <Link href="/profile">Profile</Link>
            </li>

            <li>
              <div onClick={handleLogout}>Log out</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
