"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ArrowLeft, CircleX } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthErrorPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0d10] px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="relative w-full max-w-md"
      >
        <Card
          className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#111317]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
          data-testid="auth-error-card"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] bg-red-500/70" />

          <CardHeader className="space-y-6 pb-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-red-500/10 ring-1 ring-red-500/20">
              <CircleX className="h-7 w-7 text-red-400" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold leading-tight tracking-tight text-white">
                Authentication Failed
              </CardTitle>
              <p className="text-sm leading-relaxed text-white/60">
                We couldn't sign you in because something went wrong. Please try
                again, or return to the sign in page.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <Link
              href="/sign-in"
              aria-label="Go to sign in"
              data-testid="auth-error-signin-link"
              className="inline-flex h-10 w-full items-center justify-center rounded-full bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500/90 focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              Go to Sign In
            </Link>

            <Link
              href="/sign-up"
              aria-label="Create new account"
              data-testid="auth-error-signup-link"
              className="inline-flex h-10 w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              Create New Account
            </Link>

            <div className="pt-2 text-center">
              <Link
                href="/"
                aria-label="Back to home"
                data-testid="auth-error-home-link"
                className="inline-flex items-center gap-2 text-xs font-medium text-white/50 transition-colors hover:text-white/80"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
