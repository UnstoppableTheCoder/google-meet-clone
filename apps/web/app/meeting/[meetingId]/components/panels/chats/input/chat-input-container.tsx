import React, {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { Loader, Paperclip, Send, ChevronDown } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { getWSConnection } from "@/lib/socket-manager";
import { useChat } from "@/store/chat";
import { useMeeting } from "@/store/meeting";
import { capitalizeName } from "@/utils/capitalize";
import { labels, types } from "@repo/constants";
import { File } from "@repo/types";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { saveChatToDB } from "./action";

export default function ChatInputContainer({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}) {
  const [chatMessage, setChatMessage] = useState("");
  const [sendTo, setSendTo] = useState("everyone");
  const [uploading, setUploading] = useState(false);

  const currentParticipant = useMeeting((s) => s.currentParticipant);
  const otherParticipants = useMeeting((s) => s.otherParticipants);
  const setChat = useChat((s) => s.setChat);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(selected)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/generate-upload-url", {
          method: "POST",
          body: formData,
        });
        const { uploadUrl, fileName, fileType } = await response.json();

        fetch(uploadUrl, { method: "PUT", body: file });

        const fileUrl = URL.createObjectURL(file);
        setFiles((prev) => [...prev, { fileName, fileType, fileUrl }]);
      }
    } catch (error) {
      console.log("Error generating upload url: ", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    if (!currentParticipant || uploading) return;
    if (!chatMessage.trim() && files.length === 0) return;

    const chatPayload = {
      _id: uuidv4(),
      senderId: currentParticipant.id,
      sendTo,
      meetingId: currentParticipant.meetingId,
      chatMessage,
      files,
    };

    setChat(chatPayload);

    getWSConnection().send(
      JSON.stringify({
        label: labels.NORMAL_PROCESS,
        data: { type: types.SEND_MESSAGE, payload: chatPayload },
      }),
    );

    const res = await saveChatToDB(chatPayload);
    console.log(res.message);

    setChatMessage("");
    setFiles([]);
    setSendTo("everyone");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 p-3">
      {/* Send-to selector */}
      <div className="relative">
        <select
          value={sendTo}
          onChange={(e) => setSendTo(e.target.value)}
          style={{ colorScheme: "dark" }}
          className="w-full appearance-none bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs rounded-full pl-3 pr-8 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
        >
          <option value="everyone" className="bg-[#1a1d23] text-white">
            Send to Everyone
          </option>
          {otherParticipants.map((p) => (
            <option key={p.id} value={p.id} className="bg-[#1a1d23] text-white">
              Send to {capitalizeName(p.username)}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-white/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="chat-file-input"
          className="h-10 w-10 shrink-0 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Attach file"
        >
          <Paperclip size={16} />
        </label>
        <input
          ref={fileInputRef}
          id="chat-file-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
        />

        <Input
          placeholder="Send a message"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-10 rounded-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-blue-500/40"
        />

        <Button
          size="icon"
          onClick={handleSend}
          disabled={uploading || (!chatMessage.trim() && files.length === 0)}
          className="h-10 w-10 shrink-0 rounded-full bg-blue-500 hover:bg-blue-500/90 text-white disabled:opacity-40"
          aria-label="Send"
        >
          {uploading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
