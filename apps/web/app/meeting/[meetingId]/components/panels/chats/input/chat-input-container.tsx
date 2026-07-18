import { getWSConnection } from "@/lib/socket-manager";
import { useChat } from "@/store/chat";
import { useMeeting } from "@/store/meeting";
import { capitalizeName } from "@/utils/capitalize";
import { labels, types } from "@repo/constants";
import { File } from "@repo/types";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Loader, Paperclip, Send } from "lucide-react";
import React, {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
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

  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const setChat = useChat((state) => state.setChat);
  const [uploading, setUploading] = useState(false);

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setUploading(true);

    const files = e.target.files;
    if (!files) return;

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/generate-upload-url", {
          method: "POST",
          body: formData,
        });

        const { uploadUrl, fileName, fileType } = await response.json();

        console.log("Upload URL: ", uploadUrl);

        // Uploading to the s3
        fetch(uploadUrl, {
          method: "PUT",
          body: file,
        });

        const fileUrl = URL.createObjectURL(file);
        setFiles((prevFiles) => [
          ...prevFiles,
          { fileName, fileType, fileUrl },
        ]);

        setTimeout(() => {
          setUploading(false);
        }, 1000);
      } catch (error) {
        console.log("Error generating upload url: ", error);
      }
    }

    console.log("Files uploaded to s3 successfully");
  };

  const handleMessageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
  };

  const handleSend = async () => {
    if (!currentParticipant) return;
    if (uploading) return;
    if (!chatMessage && files.length === 0) return;

    const chatPayload = {
      _id: uuidv4(),
      senderId: currentParticipant.id,
      sendTo,
      meetingId: currentParticipant.meetingId,
      chatMessage,
      files,
    };

    setChat(chatPayload);

    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.SEND_MESSAGE,
        payload: chatPayload,
      },
    };

    const ws = getWSConnection();
    ws.send(JSON.stringify(message));

    const res = await saveChatToDB(chatPayload);
    console.log(res.message);

    setChatMessage("");
    setFiles([]);
    setSendTo("everyone");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSendTo(e.target.value);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Send To */}
      <select
        defaultValue={sendTo}
        value={sendTo}
        className="select w-[90%] mx-auto"
        onChange={handleSelectChange}
      >
        <option disabled={true}>Send to</option>
        <option value={"everyone"}>Everyone</option>
        {otherParticipants.map((p) => (
          <option key={p.id} value={p.id}>
            {capitalizeName(p.username)}
          </option>
        ))}
      </select>

      <div className="p-3 w-full border-base-300 flex items-center gap-2">
        {/* File Upload */}
        <label className="cursor-pointer">
          <input type="file" className="hidden" />
          <label htmlFor="file-input">
            <div className="bg-white rounded-md text-black p-2 cursor-pointer">
              <Paperclip size={16} />
            </div>
          </label>
          <input
            type="file"
            multiple
            id="file-input"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </label>

        {/* Message Input */}
        <Input
          placeholder="Send message..."
          value={chatMessage}
          onChange={handleMessageInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />

        {/* Send */}
        <Button size="icon" className="btn-primary" onClick={handleSend}>
          {uploading ? <Loader className="animate-spin" /> : <Send size={16} />}
        </Button>
      </div>
    </div>
  );
}
