import { RefObject, useRef } from "react";
import { MicOff, Mic, Pin, PinOff, Hand, VideoOff } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Participant } from "@repo/types";
import { useMeeting } from "@/store/meeting";
import { useMeetingMedia } from "@/store/meeting-media";

function SpeakingBars() {
  return (
    <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-0.5 bg-blue-400 rounded-sm wave-bar"
          style={{ height: "100%", animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}

type VideoRefRegistrar = (id: string, el: HTMLVideoElement) => void;

type Props = {
  participant: Participant & { isSelf?: boolean };
  pinned?: boolean;
  size: "sm" | "md" | "lg";
  showControlsOnHover?: boolean;
  registerVideoRef: VideoRefRegistrar;
  unregisterVideoRef: VideoRefRegistrar;
};

export default function ParticipantTile({
  participant,
  pinned = false,
  size,
  showControlsOnHover = true,
  registerVideoRef,
  unregisterVideoRef,
}: Props) {
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

  const isLocal = participant.id === currentParticipant?.id;

  // Whether the camera feed should be visually displayed.
  // NOTE: the <video> element is ALWAYS rendered (below) so the ref is always
  // registered — even for audio-only participants. This flag only toggles
  // visibility, not mount/unmount.
  const showCameraFeed = isLocal
    ? screenShare || Boolean(currentParticipant?.cameraOn)
    : Boolean(participant.cameraOn);

  // Constrain the participant hue to a blue family (200–240°) so every tile
  // stays on-brand with the dark glassy blue-500 accent aesthetic while still
  // offering subtle per-participant variation.
  const rawHue = participant.hue ?? 0;
  const primaryHue = 200 + (Math.abs(rawHue) % 40); // 200..239
  const secondaryHue = 220 + (Math.abs(rawHue) % 20); // 220..239

  return (
    <div
      data-testid={`participant-tile-${participant.id}`}
      className={cn(
        "group relative w-full h-full rounded-2xl overflow-hidden tile-shadow",
        // Bluish base matching #111317 panel token with a slight blue lift
        "bg-[#0d1524] ring-1 ring-white/5 transition-transform duration-300",
        participant.speaking && "speaking-ring",
      )}
      style={{
        // Layered radial + subtle linear tint — all blue-family, no gradients on
        // flat surfaces except this decorative tile background.
        backgroundImage: `
          radial-gradient(120% 120% at 0% 0%, hsl(${primaryHue} 70% 26% / 0.65), hsl(${secondaryHue} 65% 10% / 0.35)),
          linear-gradient(160deg, hsl(215 55% 14% / 0.6), hsl(220 60% 8% / 0.9))
        `,
      }}
    >
      {/* Always-mounted video — ref registration happens regardless of camera state. */}
      <video
        data-testid={`participant-video-${participant.id}`}
        ref={setVideoRef}
        autoPlay
        loop
        muted={isLocal}
        playsInline
        preload="metadata"
        poster={participant.avatar || undefined}
        aria-hidden={!showCameraFeed}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-200",
          showCameraFeed ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      {/* Avatar / initials layer — shown when camera is off */}
      {!showCameraFeed && (
        <div className="absolute inset-0 flex items-center justify-center">
          {participant.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.username}
              className={cn(
                "rounded-full object-cover ring-1 ring-white/10",
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
                "rounded-full flex items-center justify-center font-semibold text-white ring-1 ring-white/10",
                size === "lg"
                  ? "w-24 h-24 md:w-32 md:h-32 text-3xl md:text-4xl"
                  : size === "sm"
                    ? "w-8 h-8 text-[10px]"
                    : "w-14 h-14 md:w-20 md:h-20 text-lg md:text-2xl",
              )}
              style={{
                // Blue-family initials avatar
                background: `linear-gradient(135deg, hsl(${primaryHue} 70% 48%), hsl(${secondaryHue} 70% 32%))`,
              }}
            >
              {participant.initials}
            </div>
          )}
        </div>
      )}

      {/* Camera-off pill */}
      {!showCameraFeed && size !== "sm" && (
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/70 bg-black/40 backdrop-blur-md rounded-full px-2 py-1 border border-white/5">
          <VideoOff className="w-3 h-3" /> camera off
        </div>
      )}

      {/* Hand raised */}
      {participant.handRaised && (
        <div
          className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg pulse-soft"
          aria-label={`${participant.username} raised their hand`}
        >
          <Hand className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Bottom gradient fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"
      />

      {/* Bottom row: name/mic badge + pin */}
      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
        <div
          className={cn(
            "inline-flex items-center rounded-full bg-black/45 backdrop-blur-md text-white border border-white/5",
            badgePad,
          )}
        >
          {participant.speaking ? (
            <SpeakingBars />
          ) : participant.micOn ? (
            <Mic
              className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"}
              aria-label="Mic on"
            />
          ) : (
            <MicOff
              className={cn(
                size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3",
                "text-red-400",
              )}
              aria-label="Mic off"
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
            aria-label={pinned ? "Unpin participant" : "Pin participant"}
            aria-pressed={pinned}
            className={cn(
              "h-8 w-8 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/40 border border-white/5",
              showControlsOnHover &&
                !pinned &&
                "opacity-0 group-hover:opacity-100",
            )}
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
