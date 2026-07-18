"use client";

import Link from "next/link";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import JoinMeeting from "@/components/join-meeting";
import "dotenv/config";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";

export default function HomePage() {
  const router = useRouter();
  const meetingId = crypto.randomBytes(5).toString("hex");

  const handleCreateMeeting = () => {
    router.push(`/meeting/${meetingId}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_45%)]" />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-20">
        <div className="max-w-3xl space-y-8 text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            🚀 Fast • Secure • Reliable
          </span>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Video meetings
            <br />
            <span className="text-primary">made simple.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
            MeetFlow helps teams collaborate effortlessly with secure,
            high-quality video meetings, instant joining, and seamless
            collaboration.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button className="h-12 rounded-xl px-8 text-base font-semibold shadow-md transition-all duration-200 hover:shadow-lg">
                Sign Up Free
              </Button>
            </Link>

            <Link href="/sign-in">
              <Button
                variant="outline"
                className="h-12 rounded-xl px-8 text-base font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <Card className="mt-16 w-full max-w-3xl rounded-3xl border border-border bg-card shadow-2xl">
          <CardContent className="space-y-8 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                Ready to start?
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Create a new meeting instantly or join one with a meeting code.
              </p>
            </div>

            <Button
              onClick={handleCreateMeeting}
              className="h-12 w-full rounded-xl text-base font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
            >
              Create New Meeting
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Or Join a Meeting
                </span>
              </div>
            </div>

            <JoinMeeting />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
