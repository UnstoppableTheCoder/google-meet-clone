import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Loader, Paperclip, Send } from "lucide-react";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { PreviewCarousel } from "./preview-carousel";
import { File } from "@repo/types";
import { labels, types } from "@repo/constants";
import { useMeeting } from "@/store/meeting";
import { getWSConnection } from "@/lib/socket-manager";
import { useChat } from "@/store/chat";
import { v4 as uuidv4 } from "uuid";

export default function ChatInput() {
  const [files, setFiles] = useState<File[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const currentParticipant = useMeeting((state) => state.currentParticipant);
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
        const response = await fetch(
          "http://localhost:3000/api/generate-upload-url",
          {
            method: "POST",
            body: formData,
          },
        );

        const { uploadUrl, fileName, fileType } = await response.json();
        console.log("Upload url: ", uploadUrl);

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

        console.log("file type: ", fileType);

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
    if (uploading) return;
    if (!chatMessage && files.length === 0) return;

    const chatPayload = {
      id: uuidv4(),
      senderId: currentParticipant.id,
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

    setChatMessage("");
    setFiles([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      <div
        id="preview-container"
        className="h-30 w-full absolute top-150 px-15"
      >
        <PreviewCarousel files={files} />
      </div>

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
    </>
  );
}
