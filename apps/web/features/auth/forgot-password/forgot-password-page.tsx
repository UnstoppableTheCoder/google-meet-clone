"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { motion } from "framer-motion";
import ForgotPasswordForm from "./components/forgot-password-form";

export default function ForgotPasswordPage() {
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
          data-testid="forgot-password-card"
        >
          <CardHeader className="space-y-2 pb-4 text-center">
            <CardTitle className="text-2xl font-semibold leading-tight tracking-tight text-white">
              Forgot Password
            </CardTitle>
            <p className="text-sm leading-relaxed text-white/60">
              Enter your email and we'll send you a reset link
            </p>
          </CardHeader>

          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
