import React from "react";
import ChatFiles from "./chat-files";
import Image from "next/image";
import { cn } from "@repo/ui/lib/utils";
import { useMeeting } from "@/store/meeting";
import { ChatPayload } from "@repo/types";
import { getUsername } from "@/utils/get-username";

export default function ReceivedMessage({
  isSender,
  chat,
}: {
  isSender: boolean;
  chat: ChatPayload;
}) {
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const leftParticipants = useMeeting((state) => state.leftParticipants);

  const allParticipants = [...otherParticipants, ...leftParticipants];
  const receivedChatSender = allParticipants.find(
    (p) => p.id === chat.senderId,
  );

  if (isSender) return;
  if (!receivedChatSender) return;

  return (
    <div className="mx-1 space-y-1">
      <div className="chat chat-start space-y-1">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Image
              src={receivedChatSender.image}
              alt="profile"
              width={50}
              height={50}
            />
          </div>
        </div>
        <div className="chat-header flex gap-5">
          <p>
            From:{" "}
            <span className="text-blue-400">{getUsername(chat.senderId)}</span>
          </p>
          <p>
            To:{" "}
            <span className="text-blue-400">{getUsername(chat.sendTo)}</span>
          </p>
        </div>

        <div className="chat-bubble">
          {chat.chatMessage || "Files received"}
        </div>
        <time className="text-xs opacity-50">12:45</time>
      </div>

      <div
        className={cn(
          "flex flex-col items-end gap-1",
          chat.files.length === 0 && "hidden",
        )}
      >
        <ChatFiles chat={chat} isSender={isSender} />
        <div className="chat-footer opacity-50 ">Seen at 12:46</div>
      </div>
    </div>
  );
}
