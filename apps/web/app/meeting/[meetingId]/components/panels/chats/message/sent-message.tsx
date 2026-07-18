import { cn } from "@repo/ui/lib/utils";
import Image from "next/image";
import React from "react";
import ChatFiles from "./chat-files";
import { ChatPayload, Participant } from "@repo/types";
import { getUsername } from "@/utils/get-username";

export default function SentMessage({
  isSender,
  chat,
  currentParticipant,
}: {
  isSender: boolean;
  chat: ChatPayload;
  currentParticipant: Participant;
}) {
  if (!isSender) return;

  return (
    <div className="mx-1 space-y-1">
      <div className="chat chat-end space-y-1">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Image
              src={currentParticipant.image}
              alt="profile"
              width={50}
              height={50}
            />
          </div>
        </div>
        <div className="chat-header flex gap-5">
          <p>
            From:{" "}
            <span className="text-blue-400">{currentParticipant.username}</span>
          </p>
          <p>
            To:{" "}
            <span className="text-blue-400">{getUsername(chat.sendTo)}</span>
          </p>
        </div>
        <div className="chat-bubble">{chat.chatMessage || "Files sent"}</div>
        <time className="text-xs opacity-50">12:46</time>
      </div>
      {/* Files */}
      <div
        className={cn(
          "flex flex-col items-end gap-1",
          chat.files.length === 0 && "hidden",
        )}
      >
        <ChatFiles chat={chat} isSender={isSender} />
        <div className="chat-footer opacity-50">Seen at 12:46</div>
      </div>
    </div>
  );
}
