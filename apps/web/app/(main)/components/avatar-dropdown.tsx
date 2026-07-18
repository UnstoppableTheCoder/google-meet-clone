import { signOut, useSession } from "@/lib/auth-client";
import { Avatar } from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
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
        onSuccess: () => {
          router.push("/sign-in"); // redirect to login page
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-11 rounded-full px-2 transition-all duration-200 hover:bg-accent"
        >
          <Avatar className="h-9 w-9 border border-border">
            {user && (
              <Image
                src={user.image ?? ""}
                alt={user.name ?? "Profile"}
                width={36}
                height={36}
                className="h-full w-full rounded-full object-cover"
              />
            )}
          </Avatar>

          <div className="hidden max-w-[140px] text-left md:block">
            <p className="truncate text-sm font-semibold">{user?.name}</p>

            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>

          <ChevronDown className="hidden h-4 w-4 text-muted-foreground transition-transform duration-200 md:block data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-72 rounded-2xl border border-border bg-card p-2 shadow-2xl"
      >
        <div className="flex items-center gap-3 rounded-xl px-3 py-3">
          <Avatar className="h-12 w-12 border border-border">
            {user && (
              <Image
                src={user.image ?? ""}
                alt={user.name ?? "Profile"}
                width={48}
                height={48}
                className="h-full w-full rounded-full object-cover"
              />
            )}
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{user?.name}</p>

            <p className="truncate text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem asChild className="h-11 cursor-pointer rounded-xl">
          <Link href="/profile" className="flex items-center gap-3">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="h-11 cursor-pointer rounded-xl">
          <Link href="/dashboard" className="flex items-center gap-3">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="h-11 cursor-pointer rounded-xl text-destructive focus:text-destructive"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
