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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            className="h-11 rounded-xl"
          />

          {errors.email && (
            <p className="text-sm font-medium text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className="h-11 rounded-xl"
          />

          {errors.password && (
            <p className="text-sm font-medium text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <SocialAuth isSignupPage={false} isSubmitting={isSubmitting} />
    </div>
  );
}
