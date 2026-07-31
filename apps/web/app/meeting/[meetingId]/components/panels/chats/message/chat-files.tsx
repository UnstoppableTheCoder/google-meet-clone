import React, { useEffect, useState } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import ChatFile from "./chat-file";
import { cn } from "@repo/ui/lib/utils";
import { ChatPayload, File as ChatFileType } from "@repo/types";

type LoadedFile = ChatFileType & { url: string };

export default function ChatFiles({
  chat,
  isSender,
}: {
  chat: ChatPayload;
  isSender: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [chatFiles, setChatFiles] = useState<LoadedFile[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];

    (async () => {
      setLoading(true);
      const results = await Promise.all(
        chat.files.map(async (file) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_UPLOADS_BASE_URL}/${file.fileName}`,
          );
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          urls.push(url);
          return { ...file, url };
        }),
      );

      if (!cancelled) {
        setChatFiles(results);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [chat.files]);

  if (loading) {
    return (
      <div className="h-40 w-full rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xs text-white/50">
        Loading attachments…
      </div>
    );
  }

  if (chatFiles.length === 0) return null;

  const current = chatFiles[active];
  if (!current) return;
  const total = chatFiles.length;
  const prev = () => setActive((i) => (i === 0 ? total - 1 : i - 1));
  const next = () => setActive((i) => (i === total - 1 ? 0 : i + 1));

  return (
    <div className="relative h-44 w-full rounded-xl overflow-hidden bg-black/30 border border-white/5">
      <div className="h-full w-full flex items-center justify-center">
        <ChatFile fileName={current.fileName} fileType={current.fileType} />
      </div>

      {/* Download */}
      <a
        href={current.url}
        download
        className={cn(
          "absolute top-2 h-7 w-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors",
          isSender ? "right-2" : "left-2",
        )}
        aria-label="Download file"
      >
        <Download size={14} />
      </a>

      {/* Carousel controls */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80"
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80"
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {chatFiles.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  i === active ? "bg-white" : "bg-white/30",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
