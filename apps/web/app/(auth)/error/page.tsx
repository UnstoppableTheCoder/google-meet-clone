"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ArrowLeft, CircleX } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-destructive" />

        <CardHeader className="space-y-6 pb-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <CircleX className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Authentication Failed
            </CardTitle>

            <p className="text-sm leading-6 text-muted-foreground">
              We couldn't sign you in because something went wrong. Please try
              again, or return to the sign in page.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <Link
            href="/sign-in"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Sign In
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent"
          >
            Create New Account
          </Link>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
