import React, { useState } from "react";
import { File } from "@repo/types";
import { PreviewCarousel } from "./preview-carousel";
import ChatInputContainer from "./chat-input-container";

export default function ChatInput() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full">
      {files.length > 0 && (
        <div className="px-3 pt-3">
          <PreviewCarousel files={files} onRemoveAll={() => setFiles([])} />
        </div>
      )}
      <ChatInputContainer files={files} setFiles={setFiles} />
    </div>
  );
}
