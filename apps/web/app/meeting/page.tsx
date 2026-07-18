"use client";

import Link from "next/link";
import crypto from "crypto";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

export default function Meeting() {
  const [joinMeetingId, setJoinMeetingId] = useState("");
  const router = useRouter();

  const meetingId = crypto.randomBytes(5).toString("hex");

  const handleJoinMeeting = () => {
    router.push(`/meeting/${joinMeetingId}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_45%)]" />

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-20">
        <div className="w-full max-w-3xl space-y-10 text-center">
          <div className="space-y-5">
            <span className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
              🎥 MeetFlow
            </span>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Video meetings
              <br />
              <span className="text-primary">made simple.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
              Start a new meeting instantly or join an existing one using a
              meeting code.
            </p>
          </div>

          <Card className="rounded-3xl border border-border bg-card shadow-2xl">
            <CardContent className="space-y-8 p-8">
              <Button
                asChild
                className="h-12 w-full rounded-xl text-base font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <Link href={`/meeting/${meetingId}`}>Create New Meeting</Link>
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

              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="Enter meeting code"
                  value={joinMeetingId}
                  onChange={(e) => setJoinMeetingId(e.target.value)}
                  className="h-12 flex-1 rounded-xl"
                />

                <Button
                  onClick={handleJoinMeeting}
                  className="h-12 rounded-xl px-8 font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  Join Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
