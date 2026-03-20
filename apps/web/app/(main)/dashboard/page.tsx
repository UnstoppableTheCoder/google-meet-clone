"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import crypto from "crypto";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const [joinMeetingId, setJoinMeetingId] = useState("");
  const router = useRouter();
  const meetingId = crypto.randomBytes(5).toString("hex");

  const handleCreateMeeting = () => {
    router.push(`/meeting/${meetingId}`);
  };

  const handleJoinMeeting = () => {
    router.push(`/meeting/${joinMeetingId}`);
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>

        {/* Start / Join Meeting */}
        <div className="flex gap-4 flex-wrap">
          <button className="btn btn-primary" onClick={handleCreateMeeting}>
            New Meeting
          </button>

          <input
            placeholder="Enter meeting code"
            className="w-72 border-2 pl-3 rounded-sm"
            onChange={(e) => setJoinMeetingId(e.target.value)}
            value={joinMeetingId}
          />

          <button className="btn btn-outline" onClick={handleJoinMeeting}>
            Join
          </button>
        </div>

        {/* Meeting Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-base-100 border border-base-300">
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-semibold text-base-content">
                Instant Meeting
              </h3>

              <p className="text-sm text-base-content/70">
                Start a meeting instantly.
              </p>

              <button className="btn btn-primary btn-sm">Start</button>
            </div>
          </div>

          <div className="bg-base-100 border border-base-300">
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-semibold text-base-content">
                Meeting History
              </h3>

              <p className="text-sm text-base-content/70">
                View your past meetings.
              </p>

              <Link href="/meetings">
                <button className="btn btn-outline  btn-sm">View</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Meetings */}
        <div className="space-y-4 ">
          <h2 className="text-xl font-semibold text-base-content">
            Recent Meetings
          </h2>

          <div className="bg-base-100 border border-base-content rounded-lg ">
            <div className="p-4 flex justify-between">
              <div>
                <p className="font-medium ">Team Standup</p>
                <p className="text-sm text-base-content/60">
                  Yesterday • 30 min
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
