import { signUp } from "@/lib/auth-client";
import { signupSchema } from "@/validation/user.validation";
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

type SignupSchema = z.infer<typeof signupSchema>;

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
    console.log("Env: ", process.env.NEXT_PUBLIC_UPLOADS_BASE_URL);

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
        onSuccess: (ctx) => {
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>

          <Input
            id="name"
            placeholder="John Doe"
            className="h-11 rounded-xl"
            {...register("name")}
          />

          {errors.name && (
            <p className="text-sm font-medium text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="h-11 rounded-xl"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm font-medium text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-11 rounded-xl"
            {...register("password")}
          />

          {errors.password && (
            <p className="text-sm font-medium text-destructive">
              {errors.password.message}
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
            placeholder="••••••••"
            className="h-11 rounded-xl"
            {...register("confirmPassword")}
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
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <SocialAuth isSignupPage={true} isSubmitting={isSubmitting} />
    </div>
  );
}
