"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { signupSchema } from "@/validation/user.validation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type SignupSchema = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<SignupSchema> = async (payload) => {
    const { data, error } = await signUp.email({
      ...payload,
      profileUrl: "https://uploads.codingthecode.site/logo.png",
    });

    if (error) {
      toast.error(error.message || "Error signup the user");
    } else {
      router.push("/dashboard");
    }

    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <Card className="w-full max-w-md shadow-xl bg-base-content text-base-100">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your details to get started
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                className="dark:bg-base-100"
                {...register("name")}
              />
              <div className="text-red-600 pt-2">{`${errors.name ? errors.name.message : ""}`}</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vipendra@email.com"
                className="dark:bg-base-100"
                {...register("email")}
              />
              <div className="text-red-600 pt-2">{`${errors.email ? errors.email.message : ""}`}</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="dark:bg-base-100"
                {...register("password")}
              />
              <div className="text-red-600 pt-2">{`${errors.password ? errors.password.message : ""}`}</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                className="dark:bg-base-100"
                {...register("confirmPassword")}
              />
              <div className="text-red-600 pt-2">
                {`${errors.confirmPassword ? errors.confirmPassword.message : ""}`}
              </div>
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting" : "Submit"}
            </Button>

            <div className="divider text-sm">OR</div>
            <Button
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
            >
              Continue with Google
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a
                href={!isSubmitting ? "/sign-in" : ""}
                className="link link-primary font-medium"
              >
                Login
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
