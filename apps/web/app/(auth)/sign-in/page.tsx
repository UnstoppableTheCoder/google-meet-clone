"use client";

import { signIn } from "@/lib/auth-client";
import { signInSchema } from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type SignInSchema = z.infer<typeof signInSchema>;

export default function SignInPage() {
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
    const { data, error } = await signIn.email(payload);

    if (error) {
      toast.error(error.message || "Error signing in the user");
    } else {
      toast.success("User signed in successfully");
      router.push("/dashboard");
    }

    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              <div className="text-red-600 py-1">
                {errors.email && errors.email.message}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              <div className="text-red-600 py-1">
                {errors.password && errors.password.message}
              </div>
            </div>

            <div className="flex justify-end text-sm">
              <a href="/forgot-password" className="link link-primary">
                Forgot password?
              </a>
            </div>

            <Button className="w-full" type="submit">
              {isSubmitting ? "Signing in" : "Sign in"}
            </Button>

            <div className="divider text-sm">OR</div>

            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <a href="/sign-up" className="link link-primary font-medium">
                Sign up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
