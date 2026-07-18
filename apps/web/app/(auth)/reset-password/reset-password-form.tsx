"use client";

import { resetPassword } from "@/lib/auth-client";
import { resetPasswordSchema } from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();

  const token = new URLSearchParams(window.location.search).get("token");
  if (!token) {
    toast.error("Token is missing");
    return;
  }

  const {
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({
    newPassword,
    confirmPassword,
  }: ResetPasswordPayload) => {
    const { data, error } = await resetPassword({
      newPassword,
      token,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset successfully");
      router.push("/sign-in");
    }

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-sm font-medium">
          New Password
        </Label>

        <Input
          {...register("newPassword")}
          id="newPassword"
          type="password"
          placeholder="Enter your new password"
          className="h-11 rounded-xl"
        />

        {errors.newPassword && (
          <p className="text-sm font-medium text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </Label>

        <Input
          {...register("confirmPassword")}
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          className="h-11 rounded-xl"
        />

        {errors.confirmPassword && (
          <p className="text-sm font-medium text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Resetting Password..." : "Reset Password"}
      </Button>
    </form>
  );
}
