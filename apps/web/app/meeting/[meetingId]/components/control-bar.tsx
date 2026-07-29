import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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
import { REACTIONS } from "../data/mockData";
import { Button } from "@repo/ui/components/button";
import { useMeeting } from "@/store/meeting";
import { useMeetingMedia } from "@/store/meeting-media";
import { toggleCamera, toggleMic } from "@/lib/media-manager";
import { handleIsRecording, handleScreenShare } from "@/lib/peer-manager";
import { handleSendHandRaise } from "@/lib/hand-raise";
import Image from "next/image";
import { handleSendMediaOn } from "@/lib/media-on";
import EndMeetingModal from "./video/end-meeting-modal";

function CtrlBtn({ active, danger, onClick, label, children, testid }: any) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          data-testid={testid}
          onClick={onClick}
          aria-label={label}
          className={cn(
            "cursor-pointer h-11 w-11 md:h-12 md:w-12 rounded-full flex items-center justify-center transition-all active:scale-95 border",
            danger
              ? "text-destructive-foreground border-destructive hover:brightness-110"
              : active
                ? "bg-gray-800 text-white border"
                : "bg-[#181A20] text-foreground border hover:bg-[#1e2027]",
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

type OptionsType =
  | "mic"
  | "camera"
  | "screen-share"
  | "is-recording"
  | "hand-raise"
  | "chats"
  | "participants"
  | "end-meeting";

export default function ControlBar() {
  // const context = useMeetingContext();
  const [endMeetingOpen, setEndMeetingOpen] = useState(false);
  const setActivePanel = useMeeting((state) => state.setActivePanel);
  const activePanel = useMeeting((state) => state.activePanel);
  const screenShare = useMeetingMedia((state) => state.screenShare);
  const isRecording = useMeetingMedia((state) => state.isRecording);
  const endMeetingRef = useRef<HTMLDialogElement | null>(null);

  const [emojiOpen, setEmojiOpen] = useState(false);

  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const setCurrentParticipantHandRaise = useMeeting(
    (state) => state.setCurrentParticipantHandRaise,
  );
  const setCameraOn = useMeeting((state) => state.setCurrentParticipantCamera);
  const setMicOn = useMeeting((state) => state.setCurrentParticipantMic);
  const cameraOn = currentParticipant?.cameraOn ?? false;
  const micOn = currentParticipant?.micOn ?? false;

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

  const handleClick = (type: OptionsType) => {
    switch (type) {
      case "mic": {
        const newState = !micOn;
        setMicOn(newState);
        break;
      }

      case "camera": {
        const newState = !cameraOn;
        setCameraOn(newState);
        break;
      }

      case "screen-share": {
        const newState = !screenShare;
        handleScreenShare(newState);
        break;
      }

      case "is-recording": {
        const newState = !isRecording;
        handleIsRecording(newState);
        break;
      }

      case "hand-raise": {
        const newState = !currentParticipant.handRaised;
        setCurrentParticipantHandRaise(newState);
        handleSendHandRaise(
          newState,
          currentParticipant.id,
          currentParticipant.meetingId,
        );
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
          <div className="glass rounded-full px-2 py-1.5 md:px-3 md:py-2 flex items-center gap-1.5 md:gap-2 shadow-xl border">
            {/* MIC */}
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

            {/* CAMERA */}
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

            <div className="w-px h-6 bg-border/70 mx-0.5" />

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
            >
              <Image
                src={isRecording ? "/recording-on.png" : "/recording-off.png"}
                alt="Recording"
                width={22}
                height={22}
              />
            </CtrlBtn>

            {/* HAND RAISE */}
            <CtrlBtn
              testid="hand-raise-btn"
              // active={handRaised}
              // onClick={onToggleHand}
              // label={handRaised ? "Lower hand" : "Raise hand"}
            >
              <Hand className="w-4 h-4 md:w-5 md:h-5" />
            </CtrlBtn>

            <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
              <PopoverTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      data-testid="reactions-btn"
                      aria-label="Send a reaction"
                      className={cn(
                        "cursor-pointer h-11 w-11 md:h-12 md:w-12 rounded-full flex items-center justify-center transition-all active:scale-95 border text-foreground",
                        emojiOpen
                          ? "bg-gray-800"
                          : "bg-[#181A20] hover:bg-[#1e2027]",
                      )}
                    >
                      <Smile className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{"Emojis"}</TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="center"
                className="p-2 w-auto rounded-full border-border"
              >
                <div className="flex items-center gap-1">
                  {REACTIONS.map((r) => (
                    <button
                      key={r}
                      data-testid={`reaction-${r}`}
                      onClick={() => {
                        // onReact(r);
                        setEmojiOpen(false);
                      }}
                      className="h-10 w-10 rounded-full hover:bg-secondary text-xl transition-transform hover:scale-125"
                      aria-label={`React with ${r}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <div className="w-px h-6 bg-border/70 mx-0.5" />

            <CtrlBtn
              testid="open-chat-btn"
              active={activePanel === "chats"}
              onClick={() => handleClick("chats")}
              label="Chat"
            >
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
            </CtrlBtn>

            <CtrlBtn
              testid="open-people-btn"
              active={activePanel === "participants"}
              onClick={() => handleClick("participants")}
              label="Participants"
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" />
            </CtrlBtn>

            <CtrlBtn testid="more-btn" onClick={() => {}} label="More options">
              <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
            </CtrlBtn>

            <div className="w-px h-6 bg-border/70 mx-0.5" />

            <Button
              data-testid="leave-call-btn"
              onClick={() => handleClick("end-meeting")}
              className="rounded-full h-11 md:h-12 px-4 md:px-5 bg-red-500 hover:bg-red-500/80 text-destructive-foreground gap-2"
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
