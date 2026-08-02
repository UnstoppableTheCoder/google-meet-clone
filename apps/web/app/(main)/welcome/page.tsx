"use client";

import crypto from "crypto";
import { useRouter } from "next/navigation";
import { Video, Plus, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import JoinMeeting from "@/components/join-meeting";
import { Button } from "@repo/ui/components/button";

export default function WelcomePage() {
  const router = useRouter();

  const handleCreateMeeting = () => {
    const meetingId = crypto.randomBytes(5).toString("hex");
    router.push(`/meeting/${meetingId}`);
  };

  return (
    <div className="relative min-h-screen bg-[#0b0d10] px-4 py-24">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center">
        {/* Hero */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="max-w-2xl space-y-5 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 ring-1 ring-white/10 backdrop-blur-xl">
            <Video className="h-7 w-7 text-blue-400" aria-hidden="true" />
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Welcome to MeetFlow
          </h1>

          <p className="text-sm leading-relaxed text-white/60 sm:text-base">
            Create secure meetings, collaborate in real time, and connect with
            your team from anywhere.
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white/50 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              End-to-end encrypted
            </span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="mt-14 grid w-full max-w-5xl gap-5 md:grid-cols-2">
          {/* Create Meeting */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="rounded-2xl border border-white/5 bg-[#111317]/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
            data-testid="create-meeting-card"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/5">
              <Plus className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>

            <h2 className="text-base font-semibold leading-tight tracking-tight text-white">
              Start a Meeting
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Create a new meeting instantly and invite participants with a
              single shareable link.
            </p>

            <Button
              onClick={handleCreateMeeting}
              data-testid="create-meeting-button"
              aria-label="Create a new meeting"
              className="mt-8 h-10 w-full rounded-full bg-blue-500 font-medium text-white shadow-none transition-colors hover:bg-blue-500/90 focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              Create New Meeting
            </Button>
          </motion.div>

          {/* Join Meeting */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="rounded-2xl border border-white/5 bg-[#111317]/95 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
            data-testid="join-meeting-card"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/5">
              <Link2 className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>

            <h2 className="text-base font-semibold leading-tight tracking-tight text-white">
              Join a Meeting
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Enter your meeting code and join an existing session in seconds.
            </p>

            <div className="mt-8">
              <JoinMeeting />
            </div>
          </motion.div>
        </div>

        {/* Footer meta */}
        <p className="mt-14 text-[11px] uppercase tracking-wider text-white/40">
          MeetFlow · Built for teams that move fast
        </p>
      </div>
    </div>
  );
}
