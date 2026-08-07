import { signUp } from "@/lib/auth-client";
import { signupSchema } from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import SocialAuth from "../../shared/components/social-auth";

type SignupSchema = z.infer<typeof signupSchema>;

const inputCls =
  "h-10 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-white/20 focus-visible:ring-2 focus-visible:ring-blue-500/40";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<SignupSchema> = async (payload) => {
    const { data, error } = await signUp.email(
      {
        ...payload,
        image: `${process.env.NEXT_PUBLIC_UPLOADS_BASE_URL}/logo.png`,
        callbackURL: "/dashboard",
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message || "Error signing up the user");
        },
        onSuccess: () => {
          toast.success(
            "If you don't have an account with us - An email has been sent for verification",
          );
        },
      },
    );

    reset();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-medium text-white/70">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            aria-label="Full name"
            data-testid="signup-name-input"
            className={inputCls}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs font-medium text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-medium text-white/70">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            aria-label="Email address"
            data-testid="signup-email-input"
            className={inputCls}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-white/70"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            aria-label="Password"
            data-testid="signup-password-input"
            className={inputCls}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirm-password"
            className="text-xs font-medium text-white/70"
          >
            Confirm Password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            aria-label="Confirm password"
            data-testid="signup-confirm-password-input"
            className={inputCls}
            {...register("confirmPassword")}
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
          aria-label="Create account"
          data-testid="signup-submit-button"
          className="h-10 w-full rounded-full bg-blue-500 text-sm font-medium text-white shadow-none transition-colors hover:bg-blue-500/90 focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:opacity-40"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <SocialAuth isSignupPage={true} isSubmitting={isSubmitting} />
    </div>
  );
}
