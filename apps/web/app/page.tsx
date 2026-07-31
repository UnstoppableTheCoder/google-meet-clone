"use client";

import Link from "next/link";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import JoinMeeting from "@/components/join-meeting";
import "dotenv/config";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { useSession } from "@/lib/auth-client";

export default function HomePage() {
  const router = useRouter();
  const meetingId = crypto.randomBytes(5).toString("hex");

  const session = useSession();

  const user = session.data?.user;

  if (user) {
    router.push("/dashboard");
  }

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
      </div>
    </div>
  );
}
