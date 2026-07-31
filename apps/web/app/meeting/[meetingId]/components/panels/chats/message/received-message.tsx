import React from "react";
import Image from "next/image";
import ChatFiles from "./chat-files";
import { useMeeting } from "@/store/meeting";
import { ChatPayload } from "@repo/types";
import { getUsername } from "@/utils/get-username";
// import { formatChatTime } from "@/utils/format-chat-time"; // optional helper – see note below

export default function ReceivedMessage({ chat }: { chat: ChatPayload }) {
  const otherParticipants = useMeeting((s) => s.otherParticipants);
  const leftParticipants = useMeeting((s) => s.leftParticipants);

  const sender = [...otherParticipants, ...leftParticipants].find(
    (p) => p.id === chat.senderId,
  );
  if (!sender) return null;

  const time = chat.createdAt
    ? new Date(chat.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const toLabel =
    chat.sendTo === "everyone" ? "Everyone" : getUsername(chat.sendTo);

  return (
    <div className="flex items-end gap-2">
      <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0">
        <Image
          src={sender.avatar}
          alt={getUsername(chat.senderId)!}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[11px] text-white/50 px-1">
          <span className="font-medium text-white/80">
            {getUsername(chat.senderId)}
          </span>
          <span>→</span>
          <span>{toLabel}</span>
          {time && <span className="opacity-70">· {time}</span>}
        </div>

        {chat.chatMessage && (
          <div className="bg-white/[0.06] text-white/90 text-sm leading-relaxed px-3 py-2 rounded-2xl rounded-bl-md border border-white/5">
            {chat.chatMessage}
          </div>
        )}

        {chat.files?.length > 0 && (
          <div className="mt-1">
            <ChatFiles chat={chat} isSender={false} />
          </div>
        )}
      </div>
    </div>
  );
}
