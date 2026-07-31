import React from "react";
import { useMeeting } from "@/store/meeting";
import ReceivedMessage from "./received-message";
import SentMessage from "./sent-message";
import { ChatPayload } from "@repo/types";
import { cn } from "@repo/ui/lib/utils";

export default function ChatMessage({ chat }: { chat: ChatPayload }) {
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  if (!currentParticipant) return null;

  const isSender = currentParticipant.id === chat.senderId;

  return (
    <div
      data-testid={`chat-msg-${chat._id}`}
      className={cn("flex w-full", isSender ? "justify-end" : "justify-start")}
    >
      <div className="max-w-[88%]">
        {isSender ? (
          <SentMessage chat={chat} currentParticipant={currentParticipant} />
        ) : (
          <ReceivedMessage chat={chat} />
        )}
      </div>
    </div>
  );
}
