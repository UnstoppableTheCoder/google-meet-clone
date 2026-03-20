"use client";

import Link from "next/link";
import crypto from "crypto";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function HomePage() {
  const [joinMeetingId, setJoinMeetingId] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const meetingId = crypto.randomBytes(5).toString("hex");

  const handleJoinMeeting = () => {
    router.push(`/meeting/${joinMeetingId}`);
  };

  const handleCreateMeeting = () => {
    router.push(`/meeting/${meetingId}`);
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex items-center justify-center p-6">
      <div className="max-w-5xl w-full space-y-10 text-center">
        <h1 className="text-5xl font-bold text-base-content">
          Video meetings for everyone
        </h1>

        <p className="text-lg text-base-content/70">
          Secure video meetings for teams, classrooms and businesses.
        </p>

        <div className="flex justify-center gap-3">
          <Link href="/sign-up">
            <button className="btn btn-primary">Sign Up Free</button>
          </Link>

          <Link href="/sign-in">
            <button className="btn btn-outline">Sign In</button>
          </Link>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          <button className="btn btn-primary" onClick={handleCreateMeeting}>
            Create a meeting
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          <input
            placeholder="Enter meeting code"
            className="w-72 pl-3 border-2  rounded-sm"
            value={joinMeetingId}
            onChange={(e) => setJoinMeetingId(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleJoinMeeting}>
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
