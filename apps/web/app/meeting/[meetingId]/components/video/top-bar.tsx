import { useMeeting } from "@/store/meeting";
import { ActivePanel } from "@/types/meeting.types";
import { Button } from "@repo/ui/components/button";
import { MessageSquare, Users } from "lucide-react";
import React from "react";
import useMeetingContext from "../../context/use-meeting-context";
import { cn } from "@repo/ui/lib/utils";

export default function TopBar() {
  const setActivePanel = useMeeting((state) => state.setActivePanel);
  const activePanel = useMeeting((state) => state.activePanel);
  const context = useMeetingContext();
  if (!context) return;
  const { topBarChatBtnRef, topBarParticipantBtnRef } = context;
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  if (!currentParticipant) return;
  const { meetingTitle } = currentParticipant;

  const handleChangePanel = (activePanel: ActivePanel) => {
    setActivePanel(activePanel);
  };

  const activeBtnStyle =
    "bg-green-500 text-white hover:bg-green-600 hover:text-white";

  return (
    <div className="flex justify-between items-center px-6 py-3 border-b border-base-300 bg-base-100">
      <h2 className="font-semibold text-base-content text-xl">
        {meetingTitle}
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-base-content/70">
          {otherParticipants.length} Participants
        </span>

        <Button
          ref={topBarChatBtnRef}
          variant="secondary"
          size="icon"
          onClick={() => handleChangePanel("chats")}
          className={cn(activePanel === "chats" && activeBtnStyle)}
        >
          <MessageSquare size={18} />
        </Button>

        <Button
          ref={topBarParticipantBtnRef}
          variant="secondary"
          size="icon"
          onClick={() => handleChangePanel("participants")}
          className={cn(activePanel === "participants" && activeBtnStyle)}
        >
          <Users size={18} />
        </Button>
      </div>
    </div>
  );
}
