import { RefObject, useEffect, useRef } from "react";
import {
  MicOff,
  Mic,
  Pin,
  PinOff,
  Hand,
  VideoOff,
  Satellite,
} from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Participant } from "@repo/types";
import { useMeeting } from "@/store/meeting";
import { p } from "framer-motion/client";
import { useMeetingMedia } from "@/store/meeting-media";

function SpeakingBars() {
  return (
    <div className="flex items-end gap-0.5 h-3">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-0.5 bg-primary rounded-sm wave-bar"
          style={{ height: "100%", animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}

export default function ParticipantTile({
  participant,
  pinned = false,
  size = "md",
  showControlsOnHover = true,
  registerVideoRef,
  unregisterVideoRef,
}: {
  participant: Participant;
  pinned?: boolean;
  size: string;
  showControlsOnHover?: boolean;
  registerVideoRef: any;
  unregisterVideoRef: any;
}) {
  const pinnedId = useMeeting((state) => state.pinnedId);
  const setPinnedId = useMeeting((state) => state.setPinnedId);
  const screenShare = useMeetingMedia((state) => state.screenShare);
  const currentParticipant = useMeeting((state) => state.currentParticipant);

  const togglePin = (id: string) => {
    setPinnedId(id === pinnedId ? null : id);
  };

  const nameSize =
    size === "lg"
      ? "text-sm md:text-base"
      : size === "sm"
        ? "text-[11px]"
        : "text-xs";

  const badgePad = size === "sm" ? "px-1.5 py-0.5 gap-1" : "px-2 py-1 gap-1.5";

  const previousVideoRef = useRef<HTMLVideoElement | null>(null);

  const setVideoRef = (element: HTMLVideoElement | null) => {
    if (previousVideoRef.current) {
      unregisterVideoRef(participant.id, previousVideoRef.current);
    }

    if (element) {
      registerVideoRef(participant.id, element);
    }

    previousVideoRef.current = element;
  };

  console.log({
    first: participant.localSettings?.cameraOn && participant.cameraOn,
    second: screenShare && participant.id === currentParticipant?.id,
  });

  const isLocal = participant.id === currentParticipant?.id;

  const shouldShowVideo = isLocal
    ? screenShare || currentParticipant.cameraOn
    : participant.cameraOn;

  return (
    <div
      data-testid={`participant-tile-${participant.id}`}
      className={cn(
        "group relative w-full h-full rounded-2xl overflow-hidden tile-shadow",
        "bg-gray-800 transition-transform duration-300",
        participant.speaking && "speaking-ring",
      )}
      style={{
        backgroundImage: `radial-gradient(120% 120% at 0% 0%, hsl(${participant.hue} 60% 22% / 0.55), hsl(${participant.hue} 60% 10% / 0.35))`,
      }}
    >
      {shouldShowVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={participant.avatar || undefined}
          ref={setVideoRef}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {participant.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.username}
              className={cn(
                "rounded-full object-cover ring-4 ring-white/10",
                size === "lg"
                  ? "w-24 h-24 md:w-32 md:h-32"
                  : size === "sm"
                    ? "w-8 h-8"
                    : "w-14 h-14 md:w-20 md:h-20",
              )}
            />
          ) : (
            <div
              className={cn(
                "rounded-full flex items-center justify-center font-display font-semibold text-white ring-4 ring-white/10",
                size === "lg"
                  ? "w-24 h-24 md:w-32 md:h-32 text-3xl md:text-4xl"
                  : size === "sm"
                    ? "w-8 h-8 text-[10px]"
                    : "w-14 h-14 md:w-20 md:h-20 text-lg md:text-2xl",
              )}
              style={{
                background: `linear-gradient(135deg, hsl(${participant.hue} 65% 45%), hsl(${(participant.hue ?? 0 + 40) % 360} 65% 35%))`,
              }}
            >
              {participant.initials}
            </div>
          )}
        </div>
      )}

      {!participant.cameraOn && size !== "sm" && (
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/70 bg-black/40 backdrop-blur-md rounded-full px-2 py-1">
          <VideoOff className="w-3 h-3" /> camera off
        </div>
      )}

      {participant.handRaised && (
        <div className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg pulse-soft">
          <Hand className="w-3.5 h-3.5" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
        <div
          className={cn(
            "inline-flex items-center rounded-full bg-black/45 backdrop-blur-md text-white",
            badgePad,
          )}
        >
          {participant.speaking ? (
            <SpeakingBars />
          ) : participant.micOn ? (
            <Mic className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
          ) : (
            <MicOff
              className={cn(
                size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3",
                "text-red-400",
              )}
            />
          )}
          <span className={cn("font-medium truncate max-w-[140px]", nameSize)}>
            {participant.isSelf
              ? `${participant.username} (you)`
              : participant.username}
          </span>
        </div>

        {size !== "sm" && (
          <button
            data-testid={`pin-btn-${participant.id}`}
            onClick={(e) => {
              e.stopPropagation();
              togglePin(participant.id);
            }}
            className={cn(
              "h-8 w-8 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors",
              showControlsOnHover &&
                !pinned &&
                "opacity-0 group-hover:opacity-100",
            )}
            aria-label={pinned ? "Unpin" : "Pin"}
          >
            {pinned ? (
              <PinOff className="w-3.5 h-3.5" />
            ) : (
              <Pin className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
