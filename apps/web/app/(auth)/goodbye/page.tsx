"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Check } from "lucide-react";

export default function GoodbyePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl">
        <CardHeader className="space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Account Deleted
            </CardTitle>

            <p className="text-sm leading-6 text-muted-foreground">
              Your account has been permanently deleted and all associated data
              has been removed.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-sm text-muted-foreground">
            Thank you for using{" "}
            <span className="font-medium text-foreground">MeetFlow</span>. We'd
            love to have you back anytime.
          </p>

          <div className="space-y-3">
            <Link
              href="/sign-up"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create a New Account
            </Link>

            <Link
              href="/"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent"
            >
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
