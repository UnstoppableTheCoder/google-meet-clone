import React from "react";
import Image from "next/image";
import ChatFiles from "./chat-files";
import { ChatPayload, Participant } from "@repo/types";
import { getUsername } from "@/utils/get-username";

export default function SentMessage({
  chat,
  currentParticipant,
}: {
  chat: ChatPayload;
  currentParticipant: Participant;
}) {
  const time = chat.createdAt
    ? new Date(chat.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const toLabel =
    chat.sendTo === "everyone" ? "Everyone" : getUsername(chat.sendTo);

  return (
    <div className="flex items-end gap-2 flex-row-reverse">
      <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0">
        <Image
          src={currentParticipant.avatar}
          alt={currentParticipant.username}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex flex-col gap-1 items-end">
        <div className="flex items-center gap-2 text-[11px] text-white/50 px-1">
          <span>To {toLabel}</span>
          {time && <span className="opacity-70">· {time}</span>}
        </div>

        {chat.chatMessage && (
          <div className="bg-blue-500/90 text-white text-sm leading-relaxed px-3 py-2 rounded-2xl rounded-br-md shadow-sm shadow-blue-500/20">
            {chat.chatMessage}
          </div>
        )}

        {chat.files?.length > 0 && (
          <div className="mt-1 w-full">
            <ChatFiles chat={chat} isSender={true} />
          </div>
        )}
      </div>
    </div>
  );
}
