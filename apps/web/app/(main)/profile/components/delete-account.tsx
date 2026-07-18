import { deleteUser } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function DeleteAccount() {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    const { data, error } = await deleteUser({
      callbackURL: "/goodbye",
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("An email has been sent to confirm the deletion");
    }
  };

  return (
    <Card className="rounded-2xl border-destructive/30 bg-destructive/5 shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-semibold tracking-tight text-destructive">
          Danger Zone
        </CardTitle>

        <p className="text-sm leading-6 text-muted-foreground">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            Delete your account
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Once deleted, your meetings, profile, and settings cannot be
            recovered.
          </p>
        </div>

        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          className="h-11 rounded-xl px-6 font-semibold"
        >
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
}
