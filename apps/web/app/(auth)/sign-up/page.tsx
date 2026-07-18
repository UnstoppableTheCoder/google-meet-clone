"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import SignupForm from "./signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl">
        <CardHeader className="space-y-6 pb-4">
          <Link
            href="/"
            className="inline-flex w-fit items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to Home
          </Link>

          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Create your account
            </CardTitle>

            <p className="text-sm leading-6 text-muted-foreground">
              Join MeetFlow and start collaborating in seconds.
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
