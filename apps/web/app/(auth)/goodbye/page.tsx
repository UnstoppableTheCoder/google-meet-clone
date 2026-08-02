"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function GoodbyePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0d10] px-4">
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
          data-testid="goodbye-card"
        >
          <CardHeader className="space-y-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-white/5 ring-1 ring-white/10">
              <Check className="h-7 w-7 text-blue-400" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold leading-tight tracking-tight text-white">
                Account Deleted
              </CardTitle>
              <p className="text-sm leading-relaxed text-white/60">
                Your account has been permanently deleted and all associated
                data has been removed.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-center text-sm leading-relaxed text-white/60">
              Thank you for using{" "}
              <span className="font-medium text-white/90">MeetFlow</span>. We'd
              love to have you back anytime.
            </p>

            <div className="space-y-3">
              <Link
                href="/sign-up"
                aria-label="Create a new account"
                data-testid="goodbye-signup-link"
                className="inline-flex h-10 w-full items-center justify-center rounded-full bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500/90 focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                Create a New Account
              </Link>

              <Link
                href="/"
                aria-label="Back to home"
                data-testid="goodbye-home-link"
                className="inline-flex h-10 w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
