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
import RemoteVideoContainer from "./containers/remote-video-container";
import LocalVideoContainer from "./containers/local-video-container";
import { Participant } from "@repo/types";

export default function VideoGrid() {
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const currentParticipant = useMeeting((state) => state.currentParticipant);

  const remoteStreamVersion = useMeetingMedia(
    (state) => state.remoteStreamVersion,
  );
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  let localStream = getLocalStream();
  const screenShare = useMeetingMedia((state) => state.screenShare);
  const { micOn, cameraOn } = currentParticipant
    ? currentParticipant
    : { micOn: false, cameraOn: false };

  // Initialize Local Stream
  useEffect(() => {
    async function initLocalStream() {
      await createLocalStream();
    }
    initLocalStream();
  }, []);

  // localStream assignment
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.muted = true;
      localVideoRef.current.srcObject = localStream;
    }
  }, [micOn, cameraOn]);

  // ScreenShare Stream assignment
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

  // Remote Streams assignments
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

  // Set Remote Video Refs
  const handleSetRemoteVideoRefs = (
    element: HTMLVideoElement,
    participantId: string,
  ) => {
    remoteVideoRefs.current[participantId] = element;
  };

  return (
    <div
      className={cn(
        "flex flex-1 flex-wrap items-center justify-center gap-6 overflow-auto p-6",
      )}
    >
      <LocalVideoContainer localVideoRef={localVideoRef} />

      {otherParticipants.map((participant, index) => (
        <RemoteVideoContainer
          key={index}
          participant={participant}
          handleSetRemoteVideoRefs={handleSetRemoteVideoRefs}
        />
      ))}
    </div>
  );
}
