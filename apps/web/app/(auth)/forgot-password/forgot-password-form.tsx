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

export default function ForgotPasswordForm() {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
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
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email address
        </Label>

        <Input
          {...register("email")}
          id="email"
          type="email"
          placeholder="name@example.com"
          className="h-11 rounded-xl"
        />

        {errors.email && (
          <p className="text-sm font-medium text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Sending reset link..." : "Send Reset Link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <a
          href="/sign-in"
          className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
        >
          Sign in
        </a>
      </p>
    </form>
  );
}
