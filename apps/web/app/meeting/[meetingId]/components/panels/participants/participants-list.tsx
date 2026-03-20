import React from "react";
import { Mic, MicOff, Video, VideoOff, Crown } from "lucide-react";
import { useMeeting } from "@/store/meeting";
import { toggleCamera, toggleMic } from "@/lib/media-manager";
import { Participant } from "@repo/types";
import Image from "next/image";

export default function ParticipantsList() {
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const allParticipants = [currentParticipant, ...otherParticipants];

  const setMicOn = useMeeting((state) => state.setCurrentParticipantMic);
  const setCameraOn = useMeeting((state) => state.setCurrentParticipantCamera);
  const setOtherParticipantCamera = useMeeting(
    (state) => state.setOtherParticipantCamera,
  );
  const setOtherParticipantMic = useMeeting(
    (state) => state.setOtherParticipantMic,
  );

  const handleClick = (type: string, participant: Participant) => {
    const { micOn, cameraOn, id } = participant;

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
          const newState = !micOn;
          setOtherParticipantMic(newState, id);
          break;
        }

        case "camera": {
          const newState = !cameraOn;
          setOtherParticipantCamera(newState, id);
          break;
        }
      }
    }
  };

  return (
    <div className="flex-2 overflow-y-auto p-3 space-y-2">
      {allParticipants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-base-200 transition"
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content w-8 rounded-full">
                <span className="flex items-center justify-center h-full">
                  <Image
                    src={participant.profile}
                    alt="logo"
                    width={50}
                    height={50}
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
            <div onClick={() => handleClick("mic", participant)}>
              {participant.micOn ? (
                <Mic size={18} className="text-green-500 cursor-pointer" />
              ) : (
                <MicOff size={18} className="text-red-500 cursor-pointer" />
              )}
            </div>

            <div onClick={() => handleClick("camera", participant)}>
              {participant.cameraOn ? (
                <Video size={18} className="text-green-500 cursor-pointer" />
              ) : (
                <VideoOff size={18} className="text-red-500 cursor-pointer" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
