"use client";

import { MouseEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMeeting } from "@/store/meeting";
import VideoSection from "./components/video/video-section";
import Panels from "./components/panels/panels";
import { closeWsConnection, setWsConnection } from "@/lib/socket-manager";
import { signaling } from "@/lib/signaling";
import useMeetingContext from "./context/use-meeting-context";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { saveMeetingHistory } from "./action";
import { Loader } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Card, CardContent } from "@repo/ui/components/card";
// import { saveMeetingHistory } from "./action";

export default function MeetingPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const context = useMeetingContext();

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
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const isEnded = useMeeting((state) => state.isEnded);
  const { data } = useSession();
  const user = data?.user;
  const [renderPermissionMessage, setRenderPermission] = useState(false);

  // Initialize
  useEffect(() => {
    if (!context) return;
    const { wsRef } = context;

    const username = user?.name;
    const image = user?.image;
    const sessionToken = data?.session.token;
    // const meetingTitle = prompt("Enter the meeting Title");
    const meetingTitle = "Google Meet";
    const userId = user?.id;

    if (
      !username ||
      !meetingTitle ||
      !meetingId ||
      !userId ||
      !image ||
      !sessionToken
    ) {
      console.log("All the fields are required");
      return;
    }

    // Set the Current Participant in the state
    setCurrentParticipant({
      id: userId,
      username,
      image,
      meetingId,
      meetingTitle,
      hasJoinedMeeting: false,
      isHost: false,
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
  }, [data]);

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
    setTimeout(() => setRenderPermission(true), 500);
  }, []);

  useEffect(() => {
    if (currentParticipant?.hasJoinedMeeting) {
      setRenderPermission(false);
    }
  }, [currentParticipant]);

  useEffect(() => {
    if (isEnded) {
      toast.success("Host ended the meeting");
    }
  }, [isEnded]);

  // Handle Chat & Participant buttons clicks
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!context) return;
    const {
      panelsRef,
      topBarChatBtnRef,
      topBarParticipantBtnRef,
      bottomBarChatBtnRef,
      bottomBarParticipantBtnRef,
    } = context;

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
      className="relative flex h-screen overflow-hidden bg-background"
      onClick={handleClick}
    >
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

      <VideoSection />

      <Panels />
    </div>
  );
}
