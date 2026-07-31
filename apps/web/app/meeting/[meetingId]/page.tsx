"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useMeeting } from "@/store/meeting";
import { useSession } from "@/lib/auth-client";
import { closeWsConnection, setWsConnection } from "@/lib/socket-manager";
import { signaling } from "@/lib/signaling";
import useMeetingContext from "./context/use-meeting-context";
import { saveMeetingHistory } from "./action";
import MeetingHeader from "./components/meeting-header";
import VideoGrid from "./components/video-grid";
import ReactionsOverlay from "./components/reactions-overlay";
import Filmstrip from "./components/filmstrip";
import ChatPanel from "./components/chat-panel";
import ParticipantsPanel from "./components/participant-panel";
import ControlBar from "./components/control-bar";
import { Card, CardContent } from "@repo/ui/components/card";
import { Loader } from "lucide-react";

export default function MeetingPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const context = useMeetingContext();

  const videoRefs = useRef<Record<string, Set<HTMLVideoElement>>>({});

  const setCurrentParticipant = useMeeting(
    (state) => state.setCurrentParticipant,
  );
  const leftParticipant = useMeeting((state) => state.leftParticipant);
  const newlyJoinedParticipant = useMeeting(
    (state) => state.newlyJoinedParticipant,
  );
  const setLeftParticipant = useMeeting((state) => state.setLeftParticipant);
  const joiningParticipants = useMeeting((state) => state.joiningParticipants);
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const pinnedId = useMeeting((state) => state.pinnedId);

  const participants =
    currentParticipant || otherParticipants.length > 0
      ? [
          { ...currentParticipant, isSelf: true },
          ...otherParticipants.map((p) => ({ ...p, isSelf: false })),
        ]
      : [];

  const isEnded = useMeeting((state) => state.isEnded);

  const { data } = useSession();
  const user = data?.user;
  const userId = data?.user?.id;
  const username = data?.user?.name;
  const avatar = data?.user?.image;
  const token = data?.session?.token;
  const [renderPermissionMessage, setRenderPermissionMessage] = useState(false);

  // Initialize
  useEffect(() => {
    if (!context) return;
    const { wsRef } = context;
    // if (wsRef.current) return;

    const username = user?.name;
    const avatar = user?.image;
    const sessionToken = data?.session.token;
    const meetingTitle = "Google Meet";
    const userId = user?.id;

    if (
      !username ||
      !meetingTitle ||
      !meetingId ||
      !userId ||
      !avatar ||
      !sessionToken
    ) {
      console.log("All the fields are required");
      return;
    }

    // Set the Current Participant in the state
    setCurrentParticipant({
      id: userId,
      username,
      avatar,
      meetingId,
      meetingTitle,
      hasJoinedMeeting: false,
      isHost: false,
      micOn: false,
      cameraOn: false,
      handRaised: false,
    });

    // Save Meeting History
    const meetingPayload = {
      userId,
      isHost: false,
      meetingId,
      meetingTitle,
      startTime: new Date(),
      endTime: null,
    };
    saveMeetingHistory(meetingPayload);

    const ws = setWsConnection(userId, meetingId, sessionToken);
    if (ws) {
      wsRef.current = ws;
      signaling(ws);
    }

    return () => {
      closeWsConnection();
    };
  }, [userId, token, meetingId]);

  // leftParticipant
  useEffect(() => {
    if (leftParticipant) {
      toast.warning(`${leftParticipant.username} left the meeting`);
    }

    setLeftParticipant(null);
  }, [leftParticipant]);

  // newlyJoinedParticipant
  useEffect(() => {
    if (newlyJoinedParticipant) {
      toast.warning(`${newlyJoinedParticipant.username} joined the meeting`);
    }
  }, [newlyJoinedParticipant]);

  // joiningParticipants
  useEffect(() => {
    const arrLength = joiningParticipants.length;
    if (arrLength > 0) {
      const currentJoiningParticipant = joiningParticipants[arrLength - 1];
      toast.success(
        currentJoiningParticipant?.username + " wants to join the meeting!",
      );
    }
  }, [joiningParticipants]);

  useEffect(() => {
    setTimeout(() => setRenderPermissionMessage(true), 500);
  }, []);

  useEffect(() => {
    if (currentParticipant?.hasJoinedMeeting) {
      setRenderPermissionMessage(false);
    }
  }, [currentParticipant]);

  useEffect(() => {
    if (isEnded) {
      toast.success("Host ended the meeting");
    }
  }, [isEnded]);

  const registerVideoRef = (
    participantId: string,
    element: HTMLVideoElement,
  ) => {
    if (!videoRefs.current[participantId]) {
      videoRefs.current[participantId] = new Set();
    }

    videoRefs.current[participantId].add(element);
  };

  const unregisterVideoRef = (
    participantId: string,
    element: HTMLVideoElement,
  ) => {
    const refs = videoRefs.current[participantId];
    if (!refs) return;

    refs.delete(element);

    if (refs.size === 0) {
      delete videoRefs.current[participantId];
    }
  };

  const [reactions, setReactions] = useState<any[]>([]);
  const [screenSharing, setScreenSharing] = useState(false);
  const [showFilmstrip, setShowFilmstrip] = useState(true);

  const pinned = useMemo(
    () => participants.find((p) => p.id === pinnedId) || null,
    [participants, pinnedId],
  );

  const sendReaction = (emoji: string) => {
    const id = `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const left = 30 + Math.random() * 40;
    setReactions((prev) => [...prev, { id, emoji, left }]);
    setTimeout(
      () => setReactions((prev) => prev.filter((r) => r.id !== id)),
      2700,
    );
  };

  return (
    <div
      data-testid="meeting-page"
      className="relative h-screen w-full flex flex-col overflow-hidden bg-[hsl(var(--meet-bg))] text-foreground"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      {renderPermissionMessage && !currentParticipant?.hasJoinedMeeting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
          <Card className="w-full max-w-lg rounded-3xl border border-border bg-card shadow-2xl">
            <CardContent className="flex flex-col items-center gap-6 p-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Waiting for the host
                </h2>

                <p className="text-sm leading-6 text-muted-foreground">
                  You've requested to join this meeting. The meeting host will
                  let you in shortly.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <MeetingHeader
        theme={"dark"}
        onToggleTheme={() => {
          console.log("Theme toggled");
        }}
        participantCount={participants.length}
        showFilmstrip={showFilmstrip}
        onToggleFilmstrip={() => setShowFilmstrip((v) => !v)}
      />

      <div className="relative z-10 flex flex-1 min-h-0">
        <main className="relative flex-1 min-w-0 flex flex-col">
          <VideoGrid
            participants={participants}
            pinned={pinned}
            screenSharing={screenSharing}
            videoRefs={videoRefs}
            registerVideoRef={registerVideoRef}
            unregisterVideoRef={unregisterVideoRef}
          />
          <ReactionsOverlay reactions={reactions} />
          {showFilmstrip && (
            <Filmstrip
              participants={participants}
              registerVideoRef={registerVideoRef}
              unregisterVideoRef={unregisterVideoRef}
            />
          )}
        </main>

        <ChatPanel />
        <ParticipantsPanel />
      </div>

      <ControlBar sendReaction={sendReaction} />
    </div>
  );
}
