import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinMeeting() {
  const [joinMeetingId, setJoinMeetingId] = useState("");
  const router = useRouter();

  const handleJoinMeeting = () => {
    router.push(`/meeting/${joinMeetingId}`);
  };

  return (
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
  );
}
