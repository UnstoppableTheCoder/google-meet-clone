"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import Link from "next/link";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl">
        <CardHeader className="space-y-6 pb-4">
          <Link
            href="/sign-in"
            className="inline-flex w-fit items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to Sign In
          </Link>

          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Reset Password
            </CardTitle>

            <p className="text-sm leading-6 text-muted-foreground">
              Create a strong new password to secure your account.
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
