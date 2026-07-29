import { AnimatePresence, motion } from "framer-motion";
import { MonitorUp } from "lucide-react";
import ParticipantTile from "./participant-tile";
import { useMeeting } from "@/store/meeting";
import { useMeetingMedia } from "@/store/meeting-media";
import { useEffect, useRef } from "react";
import { createLocalStream } from "@/lib/media-manager";
import { Participant } from "@repo/types";
import { getRemoteStream } from "@/lib/peer-manager";
import { p } from "framer-motion/client";
import { validateHeaderName } from "http";

function gridColsForCount(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count <= 4) return "grid-cols-2";
  if (count <= 6) return "grid-cols-3";
  if (count <= 9) return "grid-cols-3";
  if (count <= 12) return "grid-cols-4";
  if (count <= 16) return "grid-cols-4";
  return "grid-cols-5";
}
function gridRowsForCount(count: number) {
  if (count <= 1) return "grid-rows-1";
  if (count === 2) return "grid-rows-1";
  if (count <= 4) return "grid-rows-2";
  if (count <= 6) return "grid-rows-2";
  if (count <= 9) return "grid-rows-3";
  if (count <= 12) return "grid-rows-3";
  if (count <= 16) return "grid-rows-4";
  return "grid-rows-4";
}

export default function VideoGrid({
  participants,
  pinned,
  screenSharing,
  videoRefs,
  registerVideoRef,
  unregisterVideoRef,
}: any) {
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const currentParticipant = useMeeting((state) => state.currentParticipant);

  const localStream = useMeetingMedia((s) => s.localStream);
  const screenStream = useMeetingMedia((s) => s.screenStream);
  const screenShare = useMeetingMedia((s) => s.screenShare);
  const remoteStreamVersion = useMeetingMedia((s) => s.remoteStreamVersion);

  // Create the local stream once
  useEffect(() => {
    createLocalStream();
  }, []);

  // Assign local stream whenever it becomes available or the video element changes
  useEffect(() => {
    if (!currentParticipant || !localStream) return;

    const elements = videoRefs.current[currentParticipant.id];
    console.log("Local Elements : ", elements);
    if (!elements) return;

    elements.forEach((video: HTMLVideoElement) => {
      video.muted = true;
      video.srcObject = localStream;
    });
  }, [currentParticipant, localStream, pinned]);

  // Swap between camera and screen share
  useEffect(() => {
    if (!currentParticipant) return;

    const elements = videoRefs.current[currentParticipant.id];
    if (!elements) return;

    const stream = screenShare && screenStream ? screenStream : localStream;

    if (!stream) return;

    elements.forEach((video: HTMLVideoElement) => {
      video.srcObject = stream;
    });
  }, [screenShare, screenStream, localStream, currentParticipant, pinned]);

  // Remote Streams assignments
  useEffect(() => {
    otherParticipants.forEach((participant: Participant) => {
      const elements = videoRefs.current[participant.id];
      const remoteStream = getRemoteStream(participant.id);

      if (!remoteStream || !elements) return;
      elements.forEach((e: HTMLVideoElement) => {
        e.srcObject = remoteStream;
      });
    });
  }, [otherParticipants, remoteStreamVersion, pinned]);

  if (pinned) {
    const others = participants.filter((p: any) => p.id !== pinned.id);

    return (
      <div
        data-testid="video-area-pinned"
        className="flex-1 min-h-0 p-3 md:p-5 flex flex-col md:flex-row gap-3"
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="relative flex-1 min-h-0"
        >
          <ParticipantTile
            participant={pinned}
            pinned
            size="lg"
            showControlsOnHover={false}
            registerVideoRef={registerVideoRef}
            unregisterVideoRef={unregisterVideoRef}
          />

          {screenSharing && (
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-xs bg-primary/90 text-primary-foreground px-2.5 py-1 rounded-full shadow">
              <MonitorUp className="w-3.5 h-3.5" /> Presenting
            </div>
          )}
        </motion.div>

        <div
          data-testid="pinned-sidebar"
          className="flex md:flex-col gap-3 md:w-56 lg:w-64 overflow-x-auto md:overflow-y-auto md:max-h-full no-scrollbar shrink-0"
        >
          <AnimatePresence>
            {others.slice(0, 8).map((p: any) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="aspect-video w-56 md:w-full shrink-0"
              >
                <ParticipantTile
                  participant={p}
                  size="md"
                  // pinned={false}
                  // showControlsOnHover={true}
                  registerVideoRef={registerVideoRef}
                  unregisterVideoRef={unregisterVideoRef}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {others.length > 8 && (
            <div className="aspect-video w-56 md:w-full shrink-0 rounded-2xl bg-secondary/50 flex items-center justify-center text-sm text-muted-foreground font-medium">
              +{others.length - 8} more
            </div>
          )}
        </div>
      </div>
    );
  }

  const count = participants.length;
  const cols = gridColsForCount(count);
  const rows = gridRowsForCount(count);

  return (
    <div
      data-testid="video-area-grid"
      className="flex-1 min-h-0 p-3 md:p-5 relative"
    >
      {screenSharing && (
        <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 text-xs bg-primary/90 text-primary-foreground px-2.5 py-1 rounded-full shadow">
          <MonitorUp className="w-3.5 h-3.5" /> You are presenting
        </div>
      )}

      <motion.div
        layout
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={`grid gap-2 md:gap-3 h-full w-full ${cols} ${rows}`}
      >
        <AnimatePresence>
          {participants.map((p: any) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="min-h-0 min-w-0"
            >
              <ParticipantTile
                participant={p}
                size={count > 9 ? "sm" : "md"}
                registerVideoRef={registerVideoRef}
                unregisterVideoRef={unregisterVideoRef}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
