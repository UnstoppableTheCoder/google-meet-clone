import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, MessagesSquare } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { useMeeting } from "@/store/meeting";
import { useChat } from "@/store/chat";
import { getChats } from "./panels/chats/message/action";
import ChatMessage from "./panels/chats/message/chat-message";
import ChatInput from "./panels/chats/input/chat-input";
import { cn } from "@repo/ui/lib/utils";

export default function ChatPanel() {
  const activePanel = useMeeting((s) => s.activePanel);
  const currentParticipant = useMeeting((s) => s.currentParticipant);
  const setActivePanel = useMeeting((s) => s.setActivePanel);
  const setChats = useChat((s) => s.setChats);
  const chats = useChat((s) => s.chats);
  const chatMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentParticipant?.meetingId) return;
    getChats(currentParticipant.meetingId, currentParticipant.id)
      .then((res) => {
        if (res.success) setChats(res.chats);
      })
      .catch((e) => console.log("Error: ", e));
  }, [currentParticipant, setChats]);

  useEffect(() => {
    if (chatMessageRef.current) {
      chatMessageRef.current.scrollTop = chatMessageRef.current.scrollHeight;
    }
  }, [chats]);

  if (!currentParticipant) return null;

  return (
    <motion.aside
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      data-testid="chat-panel"
      className={cn(
        `fixed right-0 bottom-0 top-[72px] z-30 shrink-0
                 border-l border-white/5 bg-[#111317]/95 backdrop-blur-xl
                 flex flex-col shadow-2xl shadow-black/40`,
        activePanel !== "chats" && "hidden",
        "w-full xs:w-[400px] sm:w-[430px] max-w-[100vw]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
        <div className="min-w-0">
          <h2 className="font-semibold text-base leading-tight text-white">
            In-call messages
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Visible to everyone · cleared when the meeting ends
          </p>
        </div>
        <Button
          data-testid="chat-close-btn"
          variant="ghost"
          size="icon"
          onClick={() => setActivePanel("none")}
          className="rounded-full h-8 w-8 hover:bg-white/5 text-white/70"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div
        ref={chatMessageRef}
        data-testid="chat-messages"
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 py-4"
      >
        {chats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 px-6">
            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
              <MessagesSquare className="w-5 h-5 text-white/50" />
            </div>
            <div>
              <div className="text-sm font-medium text-white/90">
                No messages yet
              </div>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Say hi — messages are visible to everyone in the call and
                cleared when the meeting ends.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {chats.map((chat, index) => (
              <ChatMessage key={chat._id ?? index} chat={chat} />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-white/5 bg-black/20">
        <ChatInput />
      </div>
    </motion.aside>
  );
}
