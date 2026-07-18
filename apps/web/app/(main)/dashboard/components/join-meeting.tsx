import React, { useState } from "react";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

export default function JoinMeeting() {
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
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <Button
        onClick={handleCreateMeeting}
        className="h-11 rounded-xl px-6 font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
      >
        New Meeting
      </Button>

      <div className="flex flex-1 gap-3">
        <Input
          placeholder="Enter meeting code"
          value={joinMeetingId}
          onChange={(e) => setJoinMeetingId(e.target.value)}
          className="h-11 flex-1 rounded-xl"
        />

        <Button
          variant="outline"
          onClick={handleJoinMeeting}
          className="h-11 rounded-xl px-6 transition-all duration-200 hover:shadow-sm"
        >
          Join
        </Button>
      </div>
    </div>
  );
}
