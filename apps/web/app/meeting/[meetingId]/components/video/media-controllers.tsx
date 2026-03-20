import { toggleCamera, toggleMic } from "@/lib/media-manager";
import { handleIsRecording, handleScreenShare } from "@/lib/peer-manager";
import { useMeetingMedia } from "@/store/meeting-media";
import { Button } from "@repo/ui/components/button";
import {
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
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default function MediaControllers() {
  const context = useMeetingContext();
  if (!context) return;
  const { bottomBarChatBtnRef, bottomBarParticipantBtnRef } = context;
  const setActivePanel = useMeeting((state) => state.setActivePanel);
  const activePanel = useMeeting((state) => state.activePanel);
  const screenShare = useMeetingMedia((state) => state.screenShare);
  const isRecording = useMeetingMedia((state) => state.isRecording);
  const setScreenShare = useMeetingMedia((state) => state.setScreenShare);
  const setIsRecording = useMeetingMedia((state) => state.setIsRecording);
  const endMeetingRef = useRef<HTMLDialogElement | null>(null);

  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const setCameraOn = useMeeting((state) => state.setCurrentParticipantCamera);
  const setMicOn = useMeeting((state) => state.setCurrentParticipantMic);

  if (!currentParticipant) return;
  const { cameraOn, micOn } = currentParticipant;

  const handleClick = (type: string) => {
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
    "bg-green-500 text-white hover:bg-green-600 hover:text-white";

  return (
    <>
      <div className="flex justify-center gap-4 p-4 border-t border-base-300 bg-base-100">
        {/* MIC */}
        <Button
          variant="secondary"
          className={cn("py-5", micOn && activeBtnStyle)}
          onClick={() => handleClick("mic")}
        >
          {micOn ? <Mic className="size-6" /> : <MicOff className="size-6" />}
        </Button>

        {/* Video */}
        <Button
          variant="secondary"
          className={cn("py-5", cameraOn && activeBtnStyle)}
          onClick={() => handleClick("camera")}
        >
          {cameraOn ? (
            <Video className="size-6" />
          ) : (
            <VideoOff className="size-6" />
          )}
        </Button>

        {/* Screen Share */}
        <div onClick={() => handleClick("screen-share")}>
          <Button
            variant="secondary"
            className={cn("py-5", screenShare && activeBtnStyle)}
          >
            <MonitorUp className="size-6" />
          </Button>
        </div>

        {/* Recording */}
        <Button
          variant="secondary"
          className={cn("font-bold py-5", isRecording && activeBtnStyle)}
          onClick={() => handleClick("is-recording")}
        >
          <Image
            src={isRecording ? "/recording-on.png" : "/recording-off.png"}
            alt="recording"
            width={30}
            height={30}
          />
        </Button>

        {/* Chats */}
        <Button
          ref={bottomBarChatBtnRef}
          variant="secondary"
          className={cn("py-5", activePanel === "chats" && activeBtnStyle)}
          onClick={() => handleClick("chats")}
        >
          <MessageSquare className="size-6" />
        </Button>

        {/* Participants */}
        <Button
          ref={bottomBarParticipantBtnRef}
          variant="secondary"
          className={cn(
            "py-5",
            activePanel === "participants" && activeBtnStyle,
          )}
          onClick={() => handleClick("participants")}
        >
          <Users className="size-6" />
        </Button>

        <Button
          variant="destructive"
          className="py-5"
          onClick={() => handleClick("end-meeting")}
        >
          <PhoneOff className="size-6" />
        </Button>
      </div>

      <EndMeetingModal endMeetingRef={endMeetingRef} />
    </>
  );
}
