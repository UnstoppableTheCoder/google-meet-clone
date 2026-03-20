import React, { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import ChatFile from "./chat-file";
import { Chat, File } from "@repo/types";
import { cn } from "@repo/ui/lib/utils";

type ChatFile = File & { url: string };

export default function ChatFiles({
  chat,
  isSender,
}: {
  chat: Chat;
  isSender: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [chatFiles, setChatFiles] = useState<ChatFile[]>([]);

  const baseUrl = "https://uploads.codingthecode.site";

  useEffect(() => {
    setLoading(true);

    const getUrl = async () => {
      const results = await Promise.all(
        chat.files.map(async (file) => {
          const response = await fetch(`${baseUrl}/${file.fileName}`);
          const blobData = await response.blob();
          const url = URL.createObjectURL(blobData);

          return { ...file, url };
        }),
      );

      setChatFiles(results);
    };

    getUrl();

    setLoading(false);
  }, [chat.files]);

  if (loading)
    return <div className="bg-gray-800 text-4xl font-bold">Loading...</div>;

  return (
    <div className="h-40 w-full rounded-lg relative">
      <div className="carousel h-full w-full">
        {/* Slide */}
        {chatFiles.map((file, index) => (
          <div
            id={`${chat.id}${index}`}
            className="carousel-item relative w-full"
          >
            <div
              className={cn(
                " absolute top-1 p-1 bg-blue-500 text-white z-10 rounded-full cursor-pointer hover:bg-blue-6000",
                isSender ? "right-1" : "left-1",
              )}
            >
              <a href={file.url} download>
                <Download size={20} />
              </a>
            </div>

            <div className="w-full flex justify-center ">
              <ChatFile fileName={file.fileName} fileType={file.fileType} />
            </div>
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a
                href={`#${chat.id}${index === 0 ? chat.files.length - 1 : index - 1}`}
                className="btn btn-circle"
              >
                ❮
              </a>
              <a
                href={`#${chat.id}${chat.files.length - 1 === index ? 0 : index + 1}`}
                className="btn btn-circle"
              >
                ❯
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
