import {
  createLocalStream,
  getLocalStream,
  getScreenStream,
} from "@/lib/media-manager";
import { getRemoteStream } from "@/lib/peer-manager";
import { useMeeting } from "@/store/meeting";
import { useMeetingMedia } from "@/store/meeting-media";
import { Card } from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";
import { Crown } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import RemoteVideoContainer from "./remote-video-container";
import LocalVideoContainer from "./local-video-container";
import { Participant } from "@repo/types";

export default function VideoGrid() {
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const currentParticipant: Participant = useMeeting(
    (state) => state.currentParticipant,
  );
  const remoteStreamVersion = useMeetingMedia(
    (state) => state.remoteStreamVersion,
  );
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  let localStream = getLocalStream();
  const screenShare = useMeetingMedia((state) => state.screenShare);
  const { micOn, cameraOn } = currentParticipant;

  // Initialize
  useEffect(() => {
    async function initLocalStream() {
      await createLocalStream();
    }
    initLocalStream();
  }, []);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [micOn, cameraOn]);

  useEffect(() => {
    if (!localVideoRef.current) return;

    if (screenShare) {
      const screenStream = getScreenStream();
      localVideoRef.current.srcObject = screenStream!;
    } else {
      const localStream = getLocalStream();
      localVideoRef.current.srcObject = localStream;
    }
  }, [screenShare]);

  useEffect(() => {
    otherParticipants.forEach((participant: Participant) => {
      const element = remoteVideoRefs.current[participant.id];
      const remoteStream = getRemoteStream(participant.id);
      const { micOn, cameraOn } = participant;

      // Enabling or disabling the audio or the video of remote peer for local peer
      remoteStream?.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = Boolean(micOn);
        } else if (track.kind === "video") {
          track.enabled = Boolean(cameraOn);
        }
      });

      if (!remoteStream || !element) return;
      element.srcObject = remoteStream;
    });
  }, [otherParticipants, remoteStreamVersion]);

  const handleSetRemoteVideoRefs = (
    element: HTMLVideoElement,
    participantId: string,
  ) => {
    remoteVideoRefs.current[participantId] = element;
  };

  return (
    <div
      className={cn(
        "flex-1 p-6 gap-4 flex flex-wrap items-center justify-center overflow-auto",
      )}
    >
      <LocalVideoContainer localVideoRef={localVideoRef} />

      {otherParticipants.map((participant, index) => (
        <RemoteVideoContainer
          key={index}
          handleSetRemoteVideoRefs={handleSetRemoteVideoRefs}
          participant={participant}
        />
      ))}
    </div>
  );
}
