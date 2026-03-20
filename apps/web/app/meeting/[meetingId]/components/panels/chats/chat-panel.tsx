import { useMeeting } from "@/store/meeting";
import React, { useEffect, useRef } from "react";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { useChat } from "@/store/chat";
import { Chat } from "@repo/types";
import { cn } from "@repo/ui/lib/utils";

export default function ChatPanel() {
  const activePanel = useMeeting((state) => state.activePanel);
  const chats = useChat((state) => state.chats);
  const chatMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessageRef.current) {
      chatMessageRef.current.scrollTop = chatMessageRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div
      className={cn(
        "w-105 border-l border-base-300 bg-base-100 flex flex-col",
        activePanel !== "chats" && "hidden",
      )}
    >
      <div className="p-4 border-b border-base-300 h-[6%]">
        <h3 className="font-semibold text-base-content">Meeting Chat</h3>
      </div>
      <div className="flex flex-col justify-center relative h-[94%]">
        <div
          className="overflow-x-auto h-[92%] no-scrollbar"
          ref={chatMessageRef}
        >
          {chats.length === 0 && (
            <div className="text-5xl font-bold h-full text-gray-400 flex items-center justify-center">
              Chats
            </div>
          )}

          {chats.map((chat: Chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="h-[8%] flex items-center ">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
