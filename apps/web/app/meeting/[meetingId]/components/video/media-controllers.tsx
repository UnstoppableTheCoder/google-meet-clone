import { toggleCamera, toggleMic } from "@/lib/media-manager";
import { handleIsRecording, handleScreenShare } from "@/lib/peer-manager";
import { useMeetingMedia } from "@/store/meeting-media";
import { Button } from "@repo/ui/components/button";
import {
  Hand,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";
import EndMeetingModal from "./end-meeting-modal";
import useMeetingContext from "../../context/use-meeting-context";
import { useMeeting } from "@/store/meeting";
import { cn } from "@repo/ui/lib/utils";
import { handleSendHandRaise } from "@/lib/hand-raise";

type OptionsType =
  | "mic"
  | "camera"
  | "screen-share"
  | "is-recording"
  | "hand-raise"
  | "chats"
  | "participants"
  | "end-meeting";

export default function MediaControllers() {
  const context = useMeetingContext();
  if (!context) return;
  const { bottomBarChatBtnRef, bottomBarParticipantBtnRef } = context;
  const setActivePanel = useMeeting((state) => state.setActivePanel);
  const activePanel = useMeeting((state) => state.activePanel);
  const screenShare = useMeetingMedia((state) => state.screenShare);
  const isRecording = useMeetingMedia((state) => state.isRecording);
  const endMeetingRef = useRef<HTMLDialogElement | null>(null);

  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const setCurrentParticipantHandRaise = useMeeting(
    (state) => state.setCurrentParticipantHandRaise,
  );
  const setCameraOn = useMeeting((state) => state.setCurrentParticipantCamera);
  const setMicOn = useMeeting((state) => state.setCurrentParticipantMic);

  if (!currentParticipant) return;
  const { cameraOn, micOn } = currentParticipant;

  const handleClick = (type: OptionsType) => {
    switch (type) {
      case "mic": {
        const newState = !micOn;
        toggleMic(newState);
        setMicOn(newState);
        break;
      }

      case "camera": {
        const newState = !cameraOn;
        toggleCamera(newState);
        setCameraOn(newState);
        break;
      }

      case "screen-share": {
        const newState = !screenShare;
        handleScreenShare(newState); // logic part
        break;
      }

      case "is-recording": {
        const newState = !isRecording;
        handleIsRecording(newState);
        break;
      }

      case "hand-raise": {
        const newState = !currentParticipant.handRaise;
        setCurrentParticipantHandRaise(newState);
        handleSendHandRaise(
          newState,
          currentParticipant.id,
          currentParticipant.meetingId,
        );
        break;
      }

      case "chats": {
        setActivePanel(type);
        break;
      }

      case "participants": {
        setActivePanel(type);
        break;
      }

      case "end-meeting": {
        endMeetingRef.current?.showModal();
        break;
      }

      default:
        break;
    }
  };

  const activeBtnStyle =
    "bg-primary text-primary-foreground shadow-md hover:bg-primary/90";

  return (
    <>
      <footer className="border-t border-border bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Mic */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleClick("mic")}
            className={cn(
              "h-12 w-12 rounded-2xl transition-all duration-200",
              micOn ? activeBtnStyle : "hover:bg-accent",
            )}
          >
            {micOn ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>

          {/* Camera */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleClick("camera")}
            className={cn(
              "h-12 w-12 rounded-2xl transition-all duration-200",
              cameraOn ? activeBtnStyle : "hover:bg-accent",
            )}
          >
            {cameraOn ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </Button>

          {/* Screen Share */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleClick("screen-share")}
            className={cn(
              "h-12 w-12 rounded-2xl transition-all duration-200",
              screenShare ? activeBtnStyle : "hover:bg-accent",
            )}
          >
            <MonitorUp className="h-5 w-5" />
          </Button>

          {/* Recording */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleClick("is-recording")}
            className={cn(
              "h-12 w-12 rounded-2xl transition-all duration-200",
              isRecording ? activeBtnStyle : "hover:bg-accent",
            )}
          >
            <Image
              src={isRecording ? "/recording-on.png" : "/recording-off.png"}
              alt="Recording"
              width={22}
              height={22}
            />
          </Button>

          {/* Raise Hand */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleClick("hand-raise")}
            className={cn(
              "h-12 w-12 rounded-2xl transition-all duration-200",
              currentParticipant.handRaise ? activeBtnStyle : "hover:bg-accent",
            )}
          >
            <Hand className="h-5 w-5" />
          </Button>

          <div className="mx-2 hidden h-8 w-px bg-border md:block" />

          {/* Chat */}
          <Button
            ref={bottomBarChatBtnRef}
            variant="ghost"
            size="icon"
            onClick={() => handleClick("chats")}
            className={cn(
              "h-12 w-12 rounded-2xl transition-all duration-200",
              activePanel === "chats" ? activeBtnStyle : "hover:bg-accent",
            )}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          {/* Participants */}
          <Button
            ref={bottomBarParticipantBtnRef}
            variant="ghost"
            size="icon"
            onClick={() => handleClick("participants")}
            className={cn(
              "h-12 w-12 rounded-2xl transition-all duration-200",
              activePanel === "participants"
                ? activeBtnStyle
                : "hover:bg-accent",
            )}
          >
            <Users className="h-5 w-5" />
          </Button>

          <div className="mx-2 hidden h-8 w-px bg-border md:block" />

          {/* Leave */}
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleClick("end-meeting")}
            className="h-12 w-12 rounded-2xl shadow-sm"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>

        <EndMeetingModal endMeetingRef={endMeetingRef} />
      </footer>
    </>
  );
}
