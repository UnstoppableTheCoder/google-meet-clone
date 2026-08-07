"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import ResetPasswordForm from "./components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0d10] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="relative w-full max-w-md"
      >
        <Card
          className="rounded-2xl border border-white/5 bg-[#111317]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
          data-testid="reset-password-card"
        >
          <CardHeader className="space-y-6 pb-4">
            <Link
              href="/sign-in"
              aria-label="Back to sign in"
              data-testid="reset-back-signin"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/90"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to Sign In
            </Link>

            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                Reset Password
              </CardTitle>
              <p className="text-sm leading-relaxed text-white/60">
                Create a strong new password to secure your account.
              </p>
            </div>
          </CardHeader>

          <CardContent className="pt-2">
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
