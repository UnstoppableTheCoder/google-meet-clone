import React from "react";
import { useMeeting } from "@/store/meeting";
import ReceivedMessage from "./received-message";
import SentMessage from "./sent-message";
import { ChatPayload } from "@repo/types";

export default function ChatMessage({ chat }: { chat: ChatPayload }) {
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  if (!currentParticipant) return;

  const isSender = currentParticipant.id === chat.senderId;

  return (
    <div className="flex-1 px-2 py-5">
      <ReceivedMessage isSender={isSender} chat={chat} />
      <SentMessage
        isSender={isSender}
        chat={chat}
        currentParticipant={currentParticipant}
      />
    </div>
  );
}
