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
    "group relative overflow-hidden rounded-3xl border border-border bg-black shadow-xl transition-all duration-300",
    otherParticipantsLength > 0 ? "h-[480px] w-[640px]" : "h-full w-full"
  )}
>
  <video
    autoPlay
    playsInline
    className="h-full w-full object-cover"
    ref={(element) => {
      if (!element) return;
      handleSetRemoteVideoRefs(element, participant.id);
    }}
  />

  {/* Top Left */}
  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-sm font-medium text-white backdrop-blur-md">
    {participant.isHost && (
      <Crown className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    )}

    <span>{participant.username}</span>

    {participant.handRaise && (
      <Image
        src="/hand-raise.svg"
        alt="Hand Raised"
        width={22}
        height={22}
      />
    )}
  </div>

  {/* Bottom Gradient */}
  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
</Card>
  );
}
