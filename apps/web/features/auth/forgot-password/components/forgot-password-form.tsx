import { requestPasswordReset } from "@/lib/auth-client";
import { forgotPasswordSchema } from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

const inputCls =
  "h-10 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-white/20 focus-visible:ring-2 focus-visible:ring-blue-500/40";

export default function ForgotPasswordForm() {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: ForgotPasswordPayload) => {
    const { data, error } = await requestPasswordReset({
      email,
      redirectTo: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Reset Password email has been sent successfully");
    }

    reset();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-medium text-white/70">
          Email address
        </Label>
        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder="name@example.com"
          aria-label="Email address"
          data-testid="forgot-email-input"
          className={inputCls}
        />
        {errors.email && (
          <p className="text-xs font-medium text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        aria-label="Send reset link"
        data-testid="forgot-submit-button"
        className="h-10 w-full rounded-full bg-blue-500 text-sm font-medium text-white shadow-none transition-colors hover:bg-blue-500/90 focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:opacity-40"
      >
        {isSubmitting ? "Sending reset link..." : "Send Reset Link"}
      </Button>

      <p className="text-center text-sm text-white/60">
        Remember your password?{" "}
        <a
          href="/sign-in"
          aria-label="Sign in"
          data-testid="forgot-signin-link"
          className="font-medium text-blue-400 transition-colors hover:text-blue-300"
        >
          Sign in
        </a>
      </p>
    </form>
  );
}
