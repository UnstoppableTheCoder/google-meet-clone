import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { changePasswordSchema } from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@repo/ui/lib/utils";
import { Label } from "@repo/ui/components/label";
type ChangePassword = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (payload: ChangePassword) => {
    const { data, error } = await changePassword({
      newPassword: payload.newPassword,
      currentPassword: payload.currentPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.error(error.message || "Error changing the password");
    } else {
      toast.success("Password updated successfully");
    }

    reset();
  };

  const handleResetPasswordForm = () => {
    reset();
  };

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Change Password
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Update your password to keep your account secure.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm font-medium">
              Current Password
            </Label>

            <Input
              id="current-password"
              type="password"
              placeholder="Enter your current password"
              className="h-11 rounded-xl"
              {...register("currentPassword")}
            />

            {errors.currentPassword && (
              <p className="text-sm font-medium text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium">
                New Password
              </Label>

              <Input
                id="new-password"
                type="password"
                placeholder="Enter a new password"
                className="h-11 rounded-xl"
                {...register("newPassword")}
              />

              {errors.newPassword && (
                <p className="text-sm font-medium text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm Password
              </Label>

              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your new password"
                className="h-11 rounded-xl"
                {...register("confirmPassword")}
              />

              {errors.confirmPassword && (
                <p className="text-sm font-medium text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetPasswordForm}
              className="h-11 rounded-xl px-6"
            >
              Reset
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl px-6 font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
