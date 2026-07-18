import React, { useState } from "react";
import { File } from "@repo/types";
import { PreviewCarousel } from "./preview-carousel";
import { cn } from "@repo/ui/lib/utils";
import ChatInputContainer from "./chat-input-container";

export default function ChatInput() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <>
      <div
        id="preview-container"
        className={cn(
          "h-30 w-full absolute top-135 px-15",
          files.length === 0 && "hidden",
        )}
      >
        <PreviewCarousel files={files} />
      </div>

      <ChatInputContainer files={files} setFiles={setFiles} />
    </>
  );
}
