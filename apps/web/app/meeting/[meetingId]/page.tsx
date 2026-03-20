"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useMeeting } from "@/store/meeting";
import VideoSection from "./components/video/video-section";
import Panels from "./components/panels/panels";
import { closeWsConnection, setWsConnection } from "@/lib/socket-manager";
import { signaling } from "@/lib/signaling";
import useMeetingContext from "./context/use-meeting-context";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function MeetingPage() {
  // const initializedRef = useRef(false);

  const { meetingId } = useParams<{ meetingId: string }>();
  const context = useMeetingContext();
  if (!context) return;
  const {
    wsRef,
    panelsRef,
    topBarChatBtnRef,
    topBarParticipantBtnRef,
    bottomBarChatBtnRef,
    bottomBarParticipantBtnRef,
  } = context;

  const setCurrentParticipant = useMeeting(
    (state) => state.setCurrentParticipant,
  );
  const setActivePanel = useMeeting((state) => state.setActivePanel);
  const leftParticipant = useMeeting((state) => state.leftParticipant);
  const newlyJoinedParticipant = useMeeting(
    (state) => state.newlyJoinedParticipant,
  );
  const setLeftParticipant = useMeeting((state) => state.setLeftParticipant);
  const joiningParticipants = useMeeting((state) => state.joiningParticipants);

  console.log("Session: ", useSession());

  const { data } = useSession();

  // Initialize
  useEffect(() => {
    const username = data?.user.name;
    const profile = data?.user.profileUrl;
    const sessionToken = data?.session.token;
    const meetingTitle = "VIP Meeting";
    const id = uuidv4();
    if (
      !username ||
      !meetingTitle ||
      !meetingId ||
      !id ||
      !profile ||
      !sessionToken
    ) {
      console.log("All the fields are required");
      return;
    }

    // Set the Current Participant in the state
    setCurrentParticipant({
      id,
      username,
      profile,
      meetingId,
      meetingTitle,
      isHost: false,
    });

    const ws = setWsConnection(id, meetingId, sessionToken);
    if (ws) {
      wsRef.current = ws;
      signaling(ws);
    }

    return () => {
      closeWsConnection();
    };
  }, [data]);

  useEffect(() => {
    if (leftParticipant) {
      toast.warning(`${leftParticipant.username} left the meeting`);
    }

    setLeftParticipant(null);
  }, [leftParticipant]);

  useEffect(() => {
    if (newlyJoinedParticipant) {
      toast.warning(`${newlyJoinedParticipant.username} joined the meeting`);
    }
  }, [newlyJoinedParticipant]);

  useEffect(() => {
    const arrLength = joiningParticipants.length;
    if (arrLength > 0) {
      const currentJoiningParticipant = joiningParticipants[arrLength - 1];
      toast.success(
        currentJoiningParticipant?.username + " wants to join the meeting!",
      );
    }
  }, [joiningParticipants]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as Node;
    const panelsClicked = panelsRef.current?.contains(target);
    const topBarChatBtnClicked = topBarChatBtnRef.current?.contains(target);
    const topBarParticipantBtnClicked =
      topBarParticipantBtnRef.current?.contains(target);
    const bottomBarChatBtnClicked =
      bottomBarChatBtnRef.current?.contains(target);
    const bottomBarParticipantBtnClicked =
      bottomBarParticipantBtnRef.current?.contains(target);

    if (
      !panelsClicked &&
      !topBarChatBtnClicked &&
      !topBarParticipantBtnClicked &&
      !bottomBarChatBtnClicked &&
      !bottomBarParticipantBtnClicked
    ) {
      setActivePanel("none");
    }
  };

  return (
    <div
      className="h-screen flex bg-base-200 text-base-content"
      onClick={handleClick}
    >
      <VideoSection />
      <Panels />
    </div>
  );
}
