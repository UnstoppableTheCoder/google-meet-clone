import { useMeeting } from "@/store/meeting";
import { Card } from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import { Crown } from "lucide-react";
import Image from "next/image";
import React, { RefObject } from "react";

export default function LocalVideoContainer({
  localVideoRef,
}: {
  localVideoRef: RefObject<HTMLVideoElement | null>;
}) {
  const otherParticipantsLength = useMeeting(
    (state) => state.otherParticipants,
  ).length;
  const currentParticipant = useMeeting((state) => state.currentParticipant);

  return (
    <Card
      className={cn(
        "bg-black flex items-center justify-center text-white text-sm relative",
        otherParticipantsLength > 0 ? "h-120 w-150" : "h-full w-full",
      )}
    >
      <div className="absolute top-3 left-3 text-xl flex gap-3 items-center">
        {currentParticipant?.isHost && (
          <Crown size={20} className="text-yellow-500" />
        )}
        <p>You</p>
        <p>
          <Image
            src={"/hand-raise.svg"}
            alt="hand raise svg"
            width={40}
            height={40}
          />
        </p>
      </div>
      <video ref={localVideoRef} autoPlay className="w-full"></video>
    </Card>
  );
}
