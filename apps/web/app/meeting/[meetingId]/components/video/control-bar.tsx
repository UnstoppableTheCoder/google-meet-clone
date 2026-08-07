import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageSquare,
  Users,
  Hand,
  Smile,
  PhoneOff,
  MoreVertical,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { cn } from "@repo/ui/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Button } from "@repo/ui/components/button";
import { useMeeting } from "@/store/meeting";
import { useMeetingMedia } from "@/store/meeting-media";
import { toggleCamera, toggleMic } from "@/lib/media-manager";
import { handleIsRecording, handleScreenShare } from "@/lib/peer-manager";
import Image from "next/image";
import { handleSendMediaOn } from "@/lib/media-on";
import EndMeetingModal from "./end-meeting-modal";
import { handleSendHandRaise } from "@/lib/hand-raise";
import { handleSendEmoji } from "@/lib/emoji-reaction";

const REACTIONS = ["❤️", "👍", "👏", "🎉", "😂", "🙌", "🔥", "✨"];

function CtrlBtn({ active, danger, onClick, label, children, testid }: any) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          data-testid={testid}
          onClick={onClick}
          aria-label={label}
          className={cn(
            "cursor-pointer h-11 w-11 md:h-12 md:w-12 rounded-full flex items-center justify-center transition-colors active:scale-95 border",
            danger
              ? "text-destructive-foreground border-destructive hover:brightness-110"
              : active
                ? "bg-blue-500/15 text-blue-200 border-blue-400"
                : "bg-white/5 text-white border-white/10 hover:bg-white/10",
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

/**
 * Row item used inside the "More options" popover on small screens.
 * Mirrors the same styling language (rounded-full pills, blue accent for
 * active) but laid out as a full-width row with icon + label.
 */
function MoreMenuItem({
  active,
  onClick,
  label,
  icon,
  testid,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  testid?: string;
}) {
  return (
    <button
      data-testid={testid}
      onClick={onClick}
      aria-label={label}
      aria-pressed={!!active}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-full text-sm transition-colors border",
        active
          ? "bg-blue-500/15 text-blue-200 border-blue-400"
          : "bg-white/5 text-white/90 border-white/5 hover:bg-white/10",
      )}
    >
      <span className="h-8 w-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

type OptionsType =
  | "mic"
  | "camera"
  | "screen-share"
  | "is-recording"
  | "hand-raise"
  | "emoji"
  | "chats"
  | "participants"
  | "end-meeting";

export default function ControlBar({
  sendReaction,
}: {
  sendReaction: (emoji: string) => void;
}) {
  const [endMeetingOpen, setEndMeetingOpen] = useState(false);
  const setActivePanel = useMeeting((state) => state.setActivePanel);
  const activePanel = useMeeting((state) => state.activePanel);
  const screenShare = useMeetingMedia((state) => state.screenShare);
  const isRecording = useMeetingMedia((state) => state.isRecording);
  const endMeetingRef = useRef<HTMLDialogElement | null>(null);

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileEmojiOpen, setMobileEmojiOpen] = useState(false);

  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const setCurrentParticipantHandRaise = useMeeting(
    (state) => state.setCurrentParticipantHandRaise,
  );
  const setCameraOn = useMeeting((state) => state.setCurrentParticipantCamera);
  const setMicOn = useMeeting((state) => state.setCurrentParticipantMic);
  const cameraOn = currentParticipant?.cameraOn ?? false;
  const micOn = currentParticipant?.micOn ?? false;
  const handRaised = currentParticipant?.handRaised ?? false;

  useEffect(() => {
    toggleCamera(cameraOn);
    toggleMic(micOn);
  }, [cameraOn, micOn, screenShare]);

  useEffect(() => {
    if (!currentParticipant) return;

    handleSendMediaOn(
      screenShare || cameraOn,
      micOn,
      currentParticipant.id,
      currentParticipant.meetingId,
    );
  }, [screenShare, cameraOn, micOn, currentParticipant]);

  if (!currentParticipant) {
    return null;
  }

  const handleClick = (type: OptionsType, reaction?: string) => {
    switch (type) {
      case "mic": {
        setMicOn(!micOn);
        break;
      }
      case "camera": {
        setCameraOn(!cameraOn);
        break;
      }
      case "screen-share": {
        handleScreenShare(!screenShare);
        break;
      }
      case "is-recording": {
        handleIsRecording(!isRecording);
        break;
      }
      case "hand-raise": {
        const newState = !handRaised;
        setCurrentParticipantHandRaise(newState);
        handleSendHandRaise(
          newState,
          currentParticipant.id,
          currentParticipant.meetingId,
        );
        break;
      }

      case "emoji": {
        if (reaction) {
          sendReaction(reaction);
          setEmojiOpen(false);
          handleSendEmoji(
            reaction,
            currentParticipant.id,
            currentParticipant.meetingId,
          );
        }
        break;
      }

      case "chats": {
        setActivePanel(activePanel === "chats" ? "none" : "chats");
        break;
      }
      case "participants": {
        setActivePanel(
          activePanel === "participants" ? "none" : "participants",
        );
        break;
      }
      case "end-meeting": {
        setEndMeetingOpen(true);
        break;
      }
      default:
        break;
    }
  };

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <div
          data-testid="control-bar"
          className="relative flex items-center justify-center gap-2 md:gap-3 px-3 pb-4 pt-2"
        >
          <div className="glass rounded-full px-2 py-1.5 md:px-3 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-2xl shadow-black/40 border border-white/10 bg-[#111317]/95 backdrop-blur-xl">
            {/* MIC — always visible */}
            <CtrlBtn
              testid="mic-toggle-btn"
              active={micOn}
              onClick={() => handleClick("mic")}
              label={micOn ? "Mute microphone" : "Unmute microphone"}
            >
              {micOn ? (
                <Mic className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <MicOff className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </CtrlBtn>

            {/* CAMERA — always visible */}
            <CtrlBtn
              testid="cam-toggle-btn"
              active={cameraOn}
              onClick={() => handleClick("camera")}
              label={cameraOn ? "Turn off camera" : "Turn on camera"}
            >
              {cameraOn ? (
                <Video className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <VideoOff className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </CtrlBtn>

            {/* Divider — only shown when secondary group is visible */}
            <div className="hidden md:block w-px h-6 bg-white/10 mx-0.5" />

            {/* ---- SECONDARY GROUP — hidden < md, moved into More popover ---- */}
            <div className="hidden md:flex items-center gap-1.5 md:gap-2">
              {/* SCREEN SHARE */}
              <CtrlBtn
                testid="screen-share-btn"
                active={screenShare}
                onClick={() => handleClick("screen-share")}
                label={screenShare ? "Stop presenting" : "Share screen"}
              >
                <MonitorUp className="w-4 h-4 md:w-5 md:h-5" />
              </CtrlBtn>

              {/* RECORDING */}
              <CtrlBtn
                testid="recording-btn"
                onClick={() => handleClick("is-recording")}
                label={isRecording ? "Stop Recording" : "Start Recording"}
                active={isRecording}
              >
                <Image
                  src={isRecording ? "/recording-on.png" : "/recording-off.png"}
                  alt="Recording"
                  width={27}
                  height={27}
                />
              </CtrlBtn>

              {/* HAND RAISE */}
              <CtrlBtn
                testid="hand-raise-btn"
                active={handRaised}
                onClick={() => handleClick("hand-raise")}
                label={handRaised ? "Lower hand" : "Raise hand"}
              >
                <Hand className="w-4 h-4 md:w-5 md:h-5" />
              </CtrlBtn>

              {/* REACTIONS */}
              <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                <PopoverTrigger asChild>
                  <button
                    data-testid="emoji-btn"
                    aria-label="Emoji"
                    className={cn(
                      "cursor-pointer h-11 w-11 md:h-12 md:w-12 rounded-full flex items-center justify-center transition-colors active:scale-95 border",
                      emojiOpen
                        ? "bg-blue-500/15 text-blue-200 border-blue-400"
                        : "bg-white/5 text-white border-white/10 hover:bg-white/10",
                    )}
                  >
                    <Smile className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="center"
                  className="p-2 mb-5 w-auto rounded-full border border-white/10 bg-[#111317]/95 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-1">
                    {REACTIONS.map((r) => (
                      <button
                        key={r}
                        data-testid={`reaction-${r}`}
                        onClick={() => handleClick("emoji", r)}
                        className="h-10 w-10 rounded-full hover:bg-white/10 text-xl transition-transform hover:scale-125"
                        aria-label={`React with ${r}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <div className="w-px h-6 bg-white/10 mx-0.5" />
            </div>

            {/* CHATS — always visible */}
            <CtrlBtn
              testid="open-chat-btn"
              active={activePanel === "chats"}
              onClick={() => handleClick("chats")}
              label="Chat"
            >
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
            </CtrlBtn>

            {/* PARTICIPANTS — always visible */}
            <CtrlBtn
              testid="open-people-btn"
              active={activePanel === "participants"}
              onClick={() => handleClick("participants")}
              label="Participants"
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" />
            </CtrlBtn>

            {/* MORE OPTIONS — hosts collapsed items on small screens */}
            <Popover open={moreOpen} onOpenChange={setMoreOpen}>
              <PopoverTrigger asChild>
                <button
                  data-testid="more-btn"
                  aria-label="More options"
                  aria-expanded={moreOpen}
                  className={cn(
                    "cursor-pointer h-11 w-11 md:h-12 md:w-12 rounded-full flex items-center justify-center transition-colors active:scale-95 border",
                    moreOpen
                      ? "bg-blue-500/15 text-blue-200 border-blue-400"
                      : "bg-white/5 text-white border-white/10 hover:bg-white/10",
                  )}
                >
                  <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="end"
                className="mb-3 w-60 p-2 rounded-2xl border border-white/10 bg-[#111317]/95 backdrop-blur-xl shadow-2xl shadow-black/40"
              >
                <div className="flex flex-col gap-1">
                  {/* Mobile-only items (mirror the secondary group) */}
                  <div className="md:hidden flex flex-col gap-1">
                    <MoreMenuItem
                      testid="more-screen-share"
                      active={screenShare}
                      onClick={() => {
                        handleClick("screen-share");
                        setMoreOpen(false);
                      }}
                      label={screenShare ? "Stop presenting" : "Share screen"}
                      icon={<MonitorUp className="w-4 h-4" />}
                    />
                    <MoreMenuItem
                      testid="more-recording"
                      active={isRecording}
                      onClick={() => {
                        handleClick("is-recording");
                        setMoreOpen(false);
                      }}
                      label={isRecording ? "Stop recording" : "Start recording"}
                      icon={
                        <Image
                          src={
                            isRecording
                              ? "/recording-on.png"
                              : "/recording-off.png"
                          }
                          alt=""
                          width={18}
                          height={18}
                        />
                      }
                    />
                    <MoreMenuItem
                      testid="more-hand-raise"
                      active={handRaised}
                      onClick={() => {
                        handleClick("hand-raise");
                        setMoreOpen(false);
                      }}
                      label={handRaised ? "Lower hand" : "Raise hand"}
                      icon={<Hand className="w-4 h-4" />}
                    />

                    {/* Reactions — inline strip inside the menu */}
                    <div className="mt-1 px-3 py-2 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[11px] uppercase tracking-wider text-white/50 mb-2">
                        Reactions
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        {REACTIONS.map((r) => (
                          <button
                            key={r}
                            data-testid={`more-reaction-${r}`}
                            onClick={() => {
                              sendReaction(r);
                              setMoreOpen(false);
                            }}
                            className="h-9 w-9 rounded-full hover:bg-white/10 text-lg transition-transform hover:scale-125"
                            aria-label={`React with ${r}`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-white/10 my-1" />
                  </div>

                  {/* Desktop-only "more" items could go here in the future
                      (e.g. Settings, Layout, Report). For now the menu is
                      only meaningful on small screens. */}
                  <div className="hidden md:block px-3 py-2 text-xs text-white/50">
                    No additional options
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="w-px h-6 bg-white/10 mx-0.5" />

            {/* LEAVE — always visible */}
            <Button
              data-testid="leave-call-btn"
              onClick={() => handleClick("end-meeting")}
              className="rounded-full h-11 md:h-12 px-4 md:px-5 bg-red-500 hover:bg-red-500/80 text-white gap-2"
            >
              <PhoneOff className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Leave</span>
            </Button>
          </div>
        </div>
      </TooltipProvider>
      <EndMeetingModal open={endMeetingOpen} onOpenChange={setEndMeetingOpen} />
    </>
  );
}
