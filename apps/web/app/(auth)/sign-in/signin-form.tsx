import { signIn } from "@/lib/auth-client";
import { signInSchema } from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import SocialAuth from "../components/social-auth";
import Link from "next/link";

type SignInSchema = z.infer<typeof signInSchema>;

const inputCls =
  "h-10 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-white/20 focus-visible:ring-2 focus-visible:ring-blue-500/40";

export default function SigninForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInSchema> = async (payload) => {
    const { data, error } = await signIn.email({
      ...payload,
      callbackURL: "/dashboard",
      rememberMe: true,
    });

    if (error) {
      toast.error(
        `${error.message}. A verification email has been sent.` ||
          "Error signing in the user",
      );
    } else {
      toast.success("User signed in successfully");
    }

    reset();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-medium text-white/70">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            aria-label="Email address"
            data-testid="signin-email-input"
            {...register("email")}
            className={inputCls}
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-white/70"
            >
              Password
            </Label>
            <Link
              href="/forgot-password"
              aria-label="Forgot password"
              data-testid="signin-forgot-password-link"
              className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            aria-label="Password"
            data-testid="signin-password-input"
            {...register("password")}
            className={inputCls}
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          aria-label="Sign in"
          data-testid="signin-submit-button"
          className="h-10 w-full rounded-full bg-blue-500 text-sm font-medium text-white shadow-none transition-colors hover:bg-blue-500/90 focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:opacity-40"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <SocialAuth isSignupPage={false} isSubmitting={isSubmitting} />
    </div>
  );
}
