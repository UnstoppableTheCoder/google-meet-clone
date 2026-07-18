import { useMeeting } from "@/store/meeting";
import { ActivePanel } from "@/types/meeting.types";
import { Button } from "@repo/ui/components/button";
import { MessageSquare, Users } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import useMeetingContext from "../../context/use-meeting-context";
import { cn } from "@repo/ui/lib/utils";
import { getMeetingInfo } from "./actions";

export default function TopBar() {
  const setActivePanel = useMeeting((state) => state.setActivePanel);
  const activePanel = useMeeting((state) => state.activePanel);
  const context = useMeetingContext();
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const [startTime, setStartTime] = useState();
  const [time, setTime] = useState("");

  function getDuration(startTime: Date, endTime: Date) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    const duration = (end - start) / 1000;
    const h = Math.floor(duration / 3600);
    const m = Math.floor((duration % 3600) / 60);
    const s = Math.floor(duration % 60);

    const time = h
      ? `${h}h ${m}m ${s}s`
      : m
        ? `${m}m ${s}s`
        : s
          ? `${s}s`
          : "Reload the page to see";

    return time;
  }

  useEffect(() => {
    if (!currentParticipant) return;
    const { meetingId, id: userId } = currentParticipant;

    if (!startTime) {
      (async () => {
        const meetingInfo = await getMeetingInfo(meetingId, userId);
        setStartTime(meetingInfo.meeting.startTime);
      })();
      return;
    }

    const interval = setInterval(() => {
      const endTime = new Date();
      const time = getDuration(startTime, endTime);
      setTime(time);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, currentParticipant]);

  if (!currentParticipant) return;
  const { meetingTitle } = currentParticipant;

  if (!context) return;
  const { topBarChatBtnRef, topBarParticipantBtnRef } = context;

  const handleChangePanel = (activePanel: ActivePanel) => {
    setActivePanel(activePanel);
  };

  const activeBtnStyle =
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90";

  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      {/* Left */}
      <div className="min-w-0">
        <h2 className="truncate text-xl font-semibold tracking-tight">
          {meetingTitle}
        </h2>
      </div>

      {/* Center */}
      <div className="hidden rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm md:block">
        {time}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="hidden items-center rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm sm:flex">
          <Users className="mr-2 h-4 w-4" />
          {otherParticipants.length + 1} Participants
        </div>

        <Button
          ref={topBarChatBtnRef}
          variant="ghost"
          size="icon"
          onClick={() => handleChangePanel("chats")}
          className={cn(
            "h-10 w-10 rounded-xl transition-all duration-200",
            activePanel === "chats" ? activeBtnStyle : "hover:bg-accent",
          )}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>

        <Button
          ref={topBarParticipantBtnRef}
          variant="ghost"
          size="icon"
          onClick={() => handleChangePanel("participants")}
          className={cn(
            "h-10 w-10 rounded-xl transition-all duration-200",
            activePanel === "participants" ? activeBtnStyle : "hover:bg-accent",
          )}
        >
          <Users className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
