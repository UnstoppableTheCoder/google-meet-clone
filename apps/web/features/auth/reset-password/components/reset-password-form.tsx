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

const inputCls =
  "h-10 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-white/20 focus-visible:ring-2 focus-visible:ring-blue-500/40";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label
          htmlFor="newPassword"
          className="text-xs font-medium text-white/70"
        >
          New Password
        </Label>
        <Input
          {...register("newPassword")}
          id="newPassword"
          type="password"
          placeholder="Enter your new password"
          aria-label="New password"
          data-testid="reset-new-password-input"
          className={inputCls}
        />
        {errors.newPassword && (
          <p className="text-xs font-medium text-red-400">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-xs font-medium text-white/70"
        >
          Confirm Password
        </Label>
        <Input
          {...register("confirmPassword")}
          id="confirmPassword"
          type="password"
          placeholder="Confirm your new password"
          aria-label="Confirm new password"
          data-testid="reset-confirm-password-input"
          className={inputCls}
        />
        {errors.confirmPassword && (
          <p className="text-xs font-medium text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        aria-label="Reset password"
        data-testid="reset-submit-button"
        className="h-10 w-full rounded-full bg-blue-500 text-sm font-medium text-white shadow-none transition-colors hover:bg-blue-500/90 focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:opacity-40"
      >
        {isSubmitting ? "Resetting Password..." : "Reset Password"}
      </Button>
    </form>
  );
}
