import React from "react";
import { Mic, MicOff, Video, VideoOff, Crown, PinOff, Pin } from "lucide-react";
import { useMeeting } from "@/store/meeting";
import { toggleCamera, toggleMic } from "@/lib/media-manager";
import { Participant } from "@repo/types";
import Image from "next/image";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { News_Cycle } from "next/font/google";

export default function ParticipantsList() {
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  if (!currentParticipant) return;
  const allParticipants = [currentParticipant, ...otherParticipants];

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

  const togglePin = (id: string) => {
    setPinnedId(id === pinnedId ? null : id);
  };

  const handleClick = (type: string, participant: Participant) => {
    const { localSettings, micOn, cameraOn, id } = participant;

    // Local Changes
    if (participant.id === currentParticipant.id) {
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
      }
    } else {
      switch (type) {
        case "mic": {
          const newState = !localSettings?.micOn;
          setOtherParticipantLocalMic(newState, id);
          break;
        }

        case "camera": {
          const newState = !localSettings?.cameraOn;
          setOtherParticipantLocalCamera(newState, id);
          break;
        }
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {allParticipants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 transition"
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="flex items-center justify-center h-full">
                  <Image
                    src={participant.avatar}
                    alt="logo"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </span>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center gap-3">
              <span className="text-base-content">{participant.username}</span>

              {participant.isHost && (
                <Crown size={16} className="text-yellow-500" />
              )}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {participant.localSettings?.micOn ||
            participant.localSettings?.cameraOn ? (
              <>
                <div onClick={() => handleClick("mic", participant)}>
                  {participant.localSettings?.micOn ? (
                    <Mic size={18} className="text-green-500 cursor-pointer" />
                  ) : (
                    <MicOff size={18} className="text-red-500 cursor-pointer" />
                  )}
                </div>

                <div onClick={() => handleClick("camera", participant)}>
                  {participant.localSettings?.cameraOn ? (
                    <Video
                      size={18}
                      className="text-green-500 cursor-pointer"
                    />
                  ) : (
                    <VideoOff
                      size={18}
                      className="text-red-500 cursor-pointer"
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <div onClick={() => handleClick("mic", participant)}>
                  {participant.micOn ? (
                    <Mic size={18} className="text-green-500 cursor-pointer" />
                  ) : (
                    <MicOff size={18} className="text-red-500 cursor-pointer" />
                  )}
                </div>

                <div onClick={() => handleClick("camera", participant)}>
                  {participant.cameraOn ? (
                    <Video
                      size={18}
                      className="text-green-500 cursor-pointer"
                    />
                  ) : (
                    <VideoOff
                      size={18}
                      className="text-red-500 cursor-pointer"
                    />
                  )}
                </div>
              </>
            )}

            <Button
              data-testid={`people-pin-btn-${participant.id}`}
              variant="ghost"
              size="icon"
              onClick={() => togglePin(participant.id)}
              className={cn("h-8 w-8 rounded-full", pinnedId && "text-primary")}
              aria-label={pinnedId ? "Unpin" : "Pin"}
            >
              {pinnedId === participant.id ? (
                <PinOff className="w-4 h-4" />
              ) : (
                <Pin className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
