"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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

import type { Participant } from "@repo/types";
import { useMeetingMedia } from "@/store/meeting-media";

const REACTION_TTL_MS = 2700;
const PERMISSION_MSG_DELAY_MS = 500;
const MEETING_TITLE = "Google Meet";

type ParticipantWithSelf = Participant & { isSelf: boolean };

export default function MeetingPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const router = useRouter();
  const context = useMeetingContext();
  const { data: session } = useSession();

  // ---------- Local UI state ----------
  const [screenSharing, setScreenSharing] = useState(false);
  const [showFilmstrip, setShowFilmstrip] = useState(true);
  const [showPermissionMessage, setShowPermissionMessage] = useState(false);

  // ---------- Refs ----------
  const videoRefs = useRef<Record<string, Set<HTMLVideoElement>>>({});
  const reactionTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const prevJoiningIdsRef = useRef<Set<string>>(new Set());
  const bootstrappedRef = useRef(false);

  // ---------- Store (granular selectors) ----------
  const setCurrentParticipant = useMeeting((s) => s.setCurrentParticipant);
  const setLeftParticipant = useMeeting((s) => s.setLeftParticipant);
  const currentParticipant = useMeeting((s) => s.currentParticipant);
  const otherParticipants = useMeeting((s) => s.otherParticipants);
  const leftParticipant = useMeeting((s) => s.leftParticipant);
  const newlyJoinedParticipant = useMeeting((s) => s.newlyJoinedParticipant);
  const joiningParticipants = useMeeting((s) => s.joiningParticipants);
  const pinnedId = useMeeting((s) => s.pinnedId);
  const isEnded = useMeeting((s) => s.isEnded);

  const reactions = useMeetingMedia((state) => state.reactions);
  const setReaction = useMeetingMedia((state) => state.setReaction);
  const removeReaction = useMeetingMedia((state) => state.removeReaction);

  // ---------- Session ----------
  const user = session?.user;
  const sessionToken = session?.session?.token;

  // ---------- Derived ----------
  const participants = useMemo<ParticipantWithSelf[]>(() => {
    const list: ParticipantWithSelf[] = [];
    if (currentParticipant) {
      list.push({ ...currentParticipant, isSelf: true });
    }
    for (const p of otherParticipants) {
      list.push({ ...p, isSelf: false });
    }
    return list;
  }, [currentParticipant, otherParticipants]);

  const pinned = useMemo(
    () => participants.find((p) => p.id === pinnedId) ?? null,
    [participants, pinnedId],
  );

  const hasJoined = currentParticipant?.hasJoinedMeeting ?? false;
  const showWaitingCard = showPermissionMessage && !hasJoined;

  // ---------- Bootstrap: participant + WebSocket ----------
  useEffect(() => {
    if (!context) return;
    if (bootstrappedRef.current) return;

    if (
      !user?.id ||
      !user?.name ||
      !user?.image ||
      !meetingId ||
      !sessionToken
    ) {
      // Not enough info yet — will re-run when session resolves
      return;
    }

    bootstrappedRef.current = true;

    setCurrentParticipant({
      id: user.id,
      username: user.name,
      avatar: user.image,
      meetingId,
      meetingTitle: MEETING_TITLE,
      hasJoinedMeeting: false,
      isHost: false,
      micOn: false,
      cameraOn: false,
      handRaised: false,
    });

    saveMeetingHistory({
      userId: user.id,
      isHost: false,
      meetingId,
      meetingTitle: MEETING_TITLE,
      startTime: new Date(),
      endTime: null,
    });

    const ws = setWsConnection(user.id, meetingId, sessionToken);
    if (ws) {
      context.wsRef.current = ws;
      signaling(ws);
    }

    return () => {
      closeWsConnection();
      context.wsRef.current = null;
      bootstrappedRef.current = false;
    };
  }, [
    user?.id,
    user?.name,
    user?.image,
    sessionToken,
    meetingId,
    context,
    setCurrentParticipant,
  ]);

  // ---------- Toast: someone left ----------
  useEffect(() => {
    if (!leftParticipant) return;
    toast.warning(`${leftParticipant.username} left the meeting`);
    setLeftParticipant(null);
  }, [leftParticipant, setLeftParticipant]);

  // ---------- Toast: someone joined ----------
  useEffect(() => {
    if (!newlyJoinedParticipant) return;
    toast.info(`${newlyJoinedParticipant.username} joined the meeting`);
  }, [newlyJoinedParticipant]);

  // ---------- Toast: only new join requests (delta) ----------
  useEffect(() => {
    const prev = prevJoiningIdsRef.current;
    for (const p of joiningParticipants) {
      if (!prev.has(p.id)) {
        toast.success(`${p.username} wants to join the meeting`);
      }
    }
    prevJoiningIdsRef.current = new Set(joiningParticipants.map((p) => p.id));
  }, [joiningParticipants]);

  // ---------- Waiting-for-host card (debounced entry, hides on join) ----------
  useEffect(() => {
    if (hasJoined) {
      setShowPermissionMessage(false);
      return;
    }
    const t = setTimeout(
      () => setShowPermissionMessage(true),
      PERMISSION_MSG_DELAY_MS,
    );
    return () => clearTimeout(t);
  }, [hasJoined]);

  // ---------- Meeting ended by host ----------
  useEffect(() => {
    if (!isEnded) return;
    toast.success("Host ended the meeting");
    // router.push("/dashboard");
  }, [isEnded, router]);

  // ---------- Cleanup pending reaction timers on unmount ----------
  useEffect(() => {
    const timers = reactionTimersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  // ---------- Handlers ----------
  const registerVideoRef = useCallback(
    (participantId: string, element: HTMLVideoElement) => {
      const map = videoRefs.current;
      if (!map[participantId]) map[participantId] = new Set();
      map[participantId].add(element);
    },
    [],
  );

  const unregisterVideoRef = useCallback(
    (participantId: string, element: HTMLVideoElement) => {
      const set = videoRefs.current[participantId];
      if (!set) return;
      set.delete(element);
      if (set.size === 0) delete videoRefs.current[participantId];
    },
    [],
  );

  const sendReaction = useCallback((emoji: string) => {
    const id = `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const left = 30 + Math.random() * 40;

    setReaction(id, emoji, left);

    const timer = setTimeout(() => {
      removeReaction(id);
      reactionTimersRef.current.delete(id);
    }, REACTION_TTL_MS);

    reactionTimersRef.current.set(id, timer);
  }, []);

  const toggleFilmstrip = useCallback(() => setShowFilmstrip((v) => !v), []);
  const onToggleTheme = useCallback(() => {
    // TODO: theme switch
  }, []);

  console.log({ reactions });

  return (
    <div
      data-testid="meeting-page"
      className="relative h-screen w-full flex flex-col overflow-hidden bg-[#0b0d10] text-white"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      {/* Waiting for host */}
      {showWaitingCard && (
        <div
          data-testid="waiting-for-host"
          role="dialog"
          aria-live="polite"
          aria-label="Waiting for host to admit you"
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
        >
          <div className="w-full max-w-lg mx-4 rounded-2xl border border-white/10 bg-[#111317]/95 backdrop-blur-xl shadow-2xl shadow-black/40">
            <div className="flex flex-col items-center gap-6 p-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 border border-blue-400/30">
                <Loader2 className="h-6 w-6 animate-spin text-blue-200" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold leading-tight text-white">
                  Waiting for the host
                </h2>
                <p className="text-sm leading-relaxed text-white/70">
                  You've requested to join this meeting. The host will let you
                  in shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <MeetingHeader
        theme="dark"
        onToggleTheme={onToggleTheme}
        participantCount={participants.length}
        showFilmstrip={showFilmstrip}
        onToggleFilmstrip={toggleFilmstrip}
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
