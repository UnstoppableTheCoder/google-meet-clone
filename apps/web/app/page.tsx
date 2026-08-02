"use client";

import Link from "next/link";
import "dotenv/config";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Video } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { useSession } from "@/lib/auth-client";

// 👉 Replace with your preview image URL
const PREVIEW_IMAGE_URL = "./meeting-preview.png";

export default function HomePage() {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;

  if (user) {
    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0d10]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] translate-x-1/3 translate-y-1/3 rounded-full bg-blue-500/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          }}
        />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20">
        {/* Hero */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="max-w-3xl space-y-8 text-center"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/60 backdrop-blur-xl"
            data-testid="hero-badge"
          >
            <Sparkles
              className="h-3.5 w-3.5 text-blue-400"
              aria-hidden="true"
            />
            Fast · Secure · Reliable
          </span>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Video meetings
            <br />
            <span className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
              made simple.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            MeetFlow helps teams collaborate effortlessly with secure,
            high-quality video meetings, instant joining, and seamless
            collaboration.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button
                aria-label="Sign up free"
                data-testid="hero-signup-button"
                className="group h-11 w-full rounded-full bg-blue-500 px-6 text-sm font-medium text-white shadow-none transition-colors hover:bg-blue-500/90 focus-visible:ring-2 focus-visible:ring-blue-500/40 sm:w-auto"
              >
                Sign Up Free
                <ArrowRight
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>
            </Link>

            <Link href="/sign-in" className="w-full sm:w-auto">
              <Button
                variant="outline"
                aria-label="Sign in"
                data-testid="hero-signin-button"
                className="h-11 w-full rounded-full border border-white/10 bg-white/5 px-6 text-sm font-medium text-white/90 shadow-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500/40 sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6 text-[11px] uppercase tracking-wider text-white/40">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck
                className="h-3.5 w-3.5 text-white/50"
                aria-hidden="true"
              />
              End-to-end encrypted
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:inline-block" />
            <span className="inline-flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
              Instant join
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:inline-block" />
            <span className="inline-flex items-center gap-2">
              <Video className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
              HD quality
            </span>
          </div>
        </motion.div>

        {/* Preview image */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 32,
            delay: 0.1,
          }}
          className="mt-16 w-full max-w-6xl"
          data-testid="hero-preview-image"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#111317]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <img
              src={PREVIEW_IMAGE_URL}
              alt="MeetFlow meeting preview"
              className="h-auto w-full rounded-xl ring-1 ring-white/10"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
