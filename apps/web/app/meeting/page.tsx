"use client";

import Link from "next/link";
import crypto from "crypto";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Meeting() {
  const [joinMeetingId, setJoinMeetingId] = useState("");
  const router = useRouter();

  const meetingId = crypto.randomBytes(5).toString("hex");

  const handleJoinMeeting = () => {
    router.push(`/meeting/${joinMeetingId}`);
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex items-center justify-center p-6">
      <div className="max-w-5xl w-full space-y-10 text-center">
        <h1 className="text-5xl font-bold text-base-content">
          Video meetings for everyone
        </h1>

        <div className="flex justify-center gap-2 mt-6">
          <Link href={`/meeting/${meetingId}`}>
            <button className="btn btn-primary">Create a meeting</button>
          </Link>
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
