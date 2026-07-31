import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Keyboard } from "lucide-react";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";

export default function JoinMeeting() {
  const [joinMeetingId, setJoinMeetingId] = useState("");
  const router = useRouter();

  const handleJoinMeeting = () => {
    router.push(`/meeting/${joinMeetingId}`);
  };

  return (
    <div className="flex justify-center gap-2 mt-6">
      <div className="mt-8 flex justify-center px-4 w-2/3">
        <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border bg-card p-2 shadow-sm">
          <div className="flex flex-1 items-center gap-2 px-2">
            <Keyboard className="h-5 w-5 text-muted-foreground" />

            <Input
              value={joinMeetingId}
              onChange={(e) => setJoinMeetingId(e.target.value)}
              placeholder="Enter meeting code"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>

          <Button onClick={handleJoinMeeting} className="rounded-xl px-6">
            Join
          </Button>
        </div>
      </div>
    </div>
  );
}
