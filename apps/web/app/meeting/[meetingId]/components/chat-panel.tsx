import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { useMeeting } from "@/store/meeting";
import { useChat } from "@/store/chat";
import { getChats } from "./panels/chats/message/action";
import ChatMessage from "./panels/chats/message/chat-message";
import ChatInput from "./panels/chats/input/chat-input";

export default function ChatPanel() {
  const activePanel = useMeeting((state) => state.activePanel);
  const setChats = useChat((state) => state.setChats);
  const chats = useChat((state) => state.chats);
  const chatMessageRef = useRef<HTMLDivElement>(null);
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const setActivePanel = useMeeting((state) => state.setActivePanel);

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
      // endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  if (activePanel !== "chats" || !currentParticipant) return;

  return (
    <motion.aside
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      data-testid="chat-panel"
      className="w-[320px] lg:w-[360px] z-30 shrink-0 border-l border-border bg-[#111317] flex flex-col fixed right-0 bottom-0 top-22"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h2 className="font-display font-semibold text-base">
            In-call messages
          </h2>
          <p className="text-xs text-muted-foreground">
            Messages can be seen by everyone in the call
          </p>
        </div>
        <Button
          data-testid="chat-close-btn"
          variant="ghost"
          size="icon"
          onClick={() => setActivePanel("none")}
          className="rounded-full h-8 w-8"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </Button>
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
    </motion.aside>
  );
}
