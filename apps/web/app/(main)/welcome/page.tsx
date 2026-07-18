"use client";

import Link from "next/link";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import JoinMeeting from "@/components/join-meeting";
import { Button } from "@repo/ui/components/button";

export default function WelcomePage() {
  const router = useRouter();

  const handleCreateMeeting = () => {
    const meetingId = crypto.randomBytes(5).toString("hex");
    router.push(`/meeting/${meetingId}`);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-30">
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        {/* Hero */}
        <div className="max-w-2xl space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            🎥
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Welcome to MeetFlow
          </h1>

          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            Create secure meetings, collaborate in real time, and connect with
            your team from anywhere.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid w-full max-w-5xl gap-6 md:grid-cols-2">
          {/* Create Meeting */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl">
              ➕
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">
              Start a Meeting
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Create a new meeting instantly and invite participants with a
              single shareable link.
            </p>

            <Button
              onClick={handleCreateMeeting}
              className="mt-8 h-11 w-full rounded-xl font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
            >
              Create New Meeting
            </Button>
          </div>

          {/* Join Meeting */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl">
              🔗
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">
              Join a Meeting
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter your meeting code and join an existing session in seconds.
            </p>

            <div className="mt-8">
              <JoinMeeting />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
