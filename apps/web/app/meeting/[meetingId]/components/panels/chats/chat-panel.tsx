import { useMeeting } from "@/store/meeting";
import React, { useEffect, useRef } from "react";
import ChatMessage from "./message/chat-message";
import { useChat } from "@/store/chat";
import { cn } from "@repo/ui/lib/utils";
import ChatInput from "./input/chat-input";
import { getChats } from "./message/action";

export default function ChatPanel() {
  const activePanel = useMeeting((state) => state.activePanel);
  const setChats = useChat((state) => state.setChats);
  const chats = useChat((state) => state.chats);
  const chatMessageRef = useRef<HTMLDivElement>(null);
  const currentParticipant = useMeeting((state) => state.currentParticipant);

  useEffect(() => {
    if (!currentParticipant) return;
    const meetingId = currentParticipant.meetingId;
    if (meetingId) {
      getChats(meetingId, currentParticipant.id)
        .then((res) => {
          if (res.success) {
            setChats(res.chats);
            console.log(res.message);
          } else {
            console.log(res.message);
          }
        })
        .catch((e) => console.log("Error: ", e));
    }
  }, [currentParticipant]);

  useEffect(() => {
    if (chatMessageRef.current) {
      chatMessageRef.current.scrollTop = chatMessageRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div
      className={cn(
        "w-105 border-l border-base-300 bg-base-100 flex flex-col h-screen overflow-y-hidden",
        activePanel !== "chats" && "hidden",
      )}
    >
      <div className="p-4 border-b border-base-300 h-[6%]">
        <h3 className="font-semibold text-base-content">Meeting Chat</h3>
      </div>

      <div className="flex flex-col justify-center relative h-[94%]">
        <div
          className="overflow-x-auto h-[90%] no-scrollbar"
          ref={chatMessageRef}
        >
          {chats.length === 0 && (
            <div className="text-5xl font-bold h-full text-gray-400 flex items-center justify-center">
              Chats
            </div>
          )}

          {chats.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="h-[10%] flex items-center">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
