import { useMeeting } from "@/store/meeting";
import { Participant } from "@repo/types";
import { Card } from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import { Crown } from "lucide-react";
import Image from "next/image";

export default function RemoteVideoContainer({
  participant,
  handleSetRemoteVideoRefs,
}: {
  participant: Participant;
  handleSetRemoteVideoRefs: (
    element: HTMLVideoElement,
    participantId: string,
  ) => void;
}) {
  const otherParticipantsLength = useMeeting(
    (state) => state.otherParticipants,
  ).length;

  return (
    <Card
      key={participant.id}
      className={cn(
        "bg-black flex items-center justify-center text-white text-sm relative",
        otherParticipantsLength > 0 ? "h-120 w-150" : "h-full w-full",
      )}
    >
      <div className="absolute top-3 left-3 text-xl flex gap-3 items-center">
        {participant?.isHost && <Crown size={20} className="text-yellow-500" />}

        <p>{participant.username}</p>
        <p>
          <Image
            src={"/hand-raise.svg"}
            alt="hand raise svg"
            width={40}
            height={40}
          />
        </p>
      </div>
      <video
        autoPlay
        className="w-full"
        ref={(element) => {
          if (!element) return;
          handleSetRemoteVideoRefs(element, participant.id);
        }}
      ></video>
    </Card>
  );
}
