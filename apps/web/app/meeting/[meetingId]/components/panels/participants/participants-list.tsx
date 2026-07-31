import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Crown,
  Pin,
  PinOff,
  MoreVertical,
} from "lucide-react";
import { useMeeting } from "@/store/meeting";
import { toggleCamera, toggleMic } from "@/lib/media-manager";
import { Participant } from "@repo/types";
import Image from "next/image";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

type Props = {
  participants: Participant[];
};

export default function ParticipantsList({ participants }: Props) {
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const setMicOn = useMeeting((state) => state.setCurrentParticipantMic);
  const setCameraOn = useMeeting((state) => state.setCurrentParticipantCamera);
  const setOtherParticipantLocalCamera = useMeeting(
    (state) => state.setOtherParticipantLocalCamera,
  );
  const setOtherParticipantLocalMic = useMeeting(
    (state) => state.setOtherParticipantLocalMic,
  );
  const pinnedId = useMeeting((state) => state.pinnedId);
  const setPinnedId = useMeeting((state) => state.setPinnedId);

  if (!currentParticipant) return null;

  const togglePin = (id: string) => {
    setPinnedId(id === pinnedId ? null : id);
  };

  const handleClick = (type: "mic" | "camera", participant: Participant) => {
    const { localSettings, micOn, cameraOn, id } = participant;
    const isSelf = participant.id === currentParticipant.id;

    if (isSelf) {
      if (type === "mic") {
        const newState = !micOn;
        toggleMic(newState);
        setMicOn(newState);
      } else {
        const newState = !cameraOn;
        toggleCamera(newState);
        setCameraOn(newState);
      }
    } else {
      if (type === "mic") {
        setOtherParticipantLocalMic(!localSettings?.micOn, id);
      } else {
        setOtherParticipantLocalCamera(!localSettings?.cameraOn, id);
      }
    }
  };

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
          <Crown className="h-5 w-5 text-white/40" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white/90">No people found</p>
          <p className="mt-1 text-xs text-white/50">
            Try a different search term
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul
      role="list"
      data-testid="participants-list"
      className="flex flex-col gap-1 p-3"
    >
      {participants.map((participant) => {
        const isSelf = participant.id === currentParticipant.id;
        const isPinned = pinnedId === participant.id;

        // Prefer local overrides when present
        const micOn = participant.localSettings?.micOn ?? participant.micOn;
        const cameraOn =
          participant.localSettings?.cameraOn ?? participant.cameraOn;

        return (
          <li
            key={participant.id}
            data-testid={`participant-row-${participant.id}`}
            className={cn(
              "group flex items-center justify-between gap-2",
              "rounded-2xl px-2 py-2",
              "hover:bg-white/5 transition-colors",
              isPinned && "bg-blue-500/15 border border-blue-400/40",
            )}
          >
            {/* Left: avatar + name */}
            <div className="flex flex-1 min-w-0 items-center gap-3">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10 bg-white/5">
                <Image
                  src={participant.avatar}
                  alt={`${participant.username} avatar`}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 min-w-0 items-center gap-2">
                <span className="truncate text-sm text-white/90 min-w-0">
                  {participant.username}
                  {isSelf && (
                    <span className="ml-1.5 text-[11px] uppercase tracking-wider text-white/50">
                      (You)
                    </span>
                  )}
                </span>

                {participant.isHost && (
                  <span
                    className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-0.5"
                    aria-label="Host"
                  >
                    <Crown className="h-3 w-3 text-yellow-400" />
                    <span className="text-[10px] uppercase tracking-wider text-white/70">
                      Host
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Right: controls */}
            <div className="flex shrink-0 items-center gap-0.5">
              {/* Inline controls — md and up */}
              <div className="hidden md:flex items-center gap-0.5">
                <Button
                  data-testid={`people-mic-btn-${participant.id}`}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleClick("mic", participant)}
                  aria-label={micOn ? "Mute mic" : "Unmute mic"}
                  aria-pressed={micOn}
                  className={cn(
                    "h-8 w-8 rounded-full transition-colors",
                    "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-blue-500/40",
                    micOn ? "text-white/80" : "text-red-400",
                  )}
                >
                  {micOn ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  data-testid={`people-camera-btn-${participant.id}`}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleClick("camera", participant)}
                  aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
                  aria-pressed={cameraOn}
                  className={cn(
                    "h-8 w-8 rounded-full transition-colors",
                    "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-blue-500/40",
                    cameraOn ? "text-white/80" : "text-red-400",
                  )}
                >
                  {cameraOn ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <VideoOff className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  data-testid={`people-pin-btn-${participant.id}`}
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePin(participant.id)}
                  aria-label={
                    isPinned ? "Unpin participant" : "Pin participant"
                  }
                  aria-pressed={isPinned}
                  className={cn(
                    "h-8 w-8 rounded-full transition-colors",
                    "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-blue-500/40",
                    isPinned ? "text-blue-200" : "text-white/70",
                  )}
                >
                  {isPinned ? (
                    <PinOff className="h-4 w-4" />
                  ) : (
                    <Pin className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Kebab menu — below md */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      data-testid={`people-more-btn-${participant.id}`}
                      variant="ghost"
                      size="icon"
                      aria-label={`More options for ${participant.username}`}
                      className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/40"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={6}
                    data-testid={`people-more-menu-${participant.id}`}
                    className={cn(
                      "min-w-[200px] rounded-2xl p-1",
                      "bg-[#111317]/95 backdrop-blur-xl",
                      "border border-white/10 shadow-2xl shadow-black/40",
                      "text-white",
                    )}
                  >
                    <DropdownMenuItem
                      data-testid={`people-mic-menu-${participant.id}`}
                      onSelect={(e) => {
                        e.preventDefault();
                        handleClick("mic", participant);
                      }}
                      className={cn(
                        "rounded-xl px-3 py-2 gap-2 text-sm cursor-pointer",
                        "focus:bg-white/10 focus:text-white",
                        "data-[highlighted]:bg-white/10",
                        micOn ? "text-white/90" : "text-red-400",
                      )}
                    >
                      {micOn ? (
                        <Mic className="h-4 w-4" />
                      ) : (
                        <MicOff className="h-4 w-4" />
                      )}
                      <span>{micOn ? "Mute mic" : "Unmute mic"}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      data-testid={`people-camera-menu-${participant.id}`}
                      onSelect={(e) => {
                        e.preventDefault();
                        handleClick("camera", participant);
                      }}
                      className={cn(
                        "rounded-xl px-3 py-2 gap-2 text-sm cursor-pointer",
                        "focus:bg-white/10 focus:text-white",
                        "data-[highlighted]:bg-white/10",
                        cameraOn ? "text-white/90" : "text-red-400",
                      )}
                    >
                      {cameraOn ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <VideoOff className="h-4 w-4" />
                      )}
                      <span>
                        {cameraOn ? "Turn camera off" : "Turn camera on"}
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1 bg-white/10" />

                    <DropdownMenuItem
                      data-testid={`people-pin-menu-${participant.id}`}
                      onSelect={(e) => {
                        e.preventDefault();
                        togglePin(participant.id);
                      }}
                      className={cn(
                        "rounded-xl px-3 py-2 gap-2 text-sm cursor-pointer",
                        "focus:bg-white/10 focus:text-white",
                        "data-[highlighted]:bg-white/10",
                        isPinned ? "text-blue-200" : "text-white/90",
                      )}
                    >
                      {isPinned ? (
                        <PinOff className="h-4 w-4" />
                      ) : (
                        <Pin className="h-4 w-4" />
                      )}
                      <span>
                        {isPinned ? "Unpin participant" : "Pin participant"}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
