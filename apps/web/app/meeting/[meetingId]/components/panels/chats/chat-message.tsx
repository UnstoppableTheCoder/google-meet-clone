import React from "react";
import ChatFiles from "./chat-files";
import { Chat } from "@repo/types";
import { useMeeting } from "@/store/meeting";
import { cn } from "@repo/ui/lib/utils";
import Image from "next/image";

export default function ChatMessage({ chat }: { chat: Chat }) {
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const otherParticipants = useMeeting((state) => state.otherParticipants);

  const isSender = currentParticipant.id === chat.senderId;

  return (
    <div className="flex-1 px-2 py-5">
      {isSender ? (
        <div className="mx-1 space-y-1">
          <div className="chat chat-end">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <Image
                  src={currentParticipant.profile}
                  alt="profile"
                  width={50}
                  height={50}
                />
              </div>
            </div>
            <div className="chat-header">
              {currentParticipant.username}
              <time className="text-xs opacity-50">12:46</time>
            </div>
            <div className="chat-bubble">
              {chat.chatMessage || "Files sent"}
            </div>
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
      ) : (
        <div className="mx-1 space-y-1">
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <Image
                  src={
                    otherParticipants.find((p) => p.id === chat.senderId)!
                      .profile
                  }
                  alt="profile"
                  width={50}
                  height={50}
                />
              </div>
            </div>
            <div className="chat-header">
              {otherParticipants.find((p) => p.id === chat.senderId)?.username}
              <time className="text-xs opacity-50">12:45</time>
            </div>
            <div className="chat-bubble">
              {chat.chatMessage || "Files received"}
            </div>
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
      )}
    </div>
  );
}
