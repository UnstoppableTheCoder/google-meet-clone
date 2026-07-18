import { FileType } from "@repo/types";
import React from "react";

export default function ChatFile({
  fileName,
  fileType,
}: {
  fileName: string;
  fileType: FileType;
}) {
  const url = `${process.env.NEXT_PUBLIC_UPLOADS_BASE_URL}/${fileName}`;

  switch (fileType) {
    case "application/pdf":
      return (
        <div className="h-full w-full bg-gray-500 flex justify-center items-center text-white text-bold text-2xl rounded-lg">
          No PDF Preview Available
        </div>
      );

    case "image/png":
      return <img src={url} className="h-full" />;

    case "image/jpeg":
      return <img src={url} className="h-full" />;

    case "image/svg+xml":
      return <img src={url} className="h-full" />;

    case "video/mp4":
      return <video src={url} className="h-full" controls></video>;

    case "video/webm":
      return <video src={url} className="h-full" controls></video>;

    case "application/zip":
      return (
        <div className="h-full w-full bg-gray-500 flex justify-center items-center text-white text-bold text-2xl rounded-lg">
          No ZIP Preview Available
        </div>
      );

    default:
      return (
        <div className="h-full w-full bg-gray-500 flex justify-center items-center text-white text-bold text-2xl rounded-lg">
          No Preview Available
        </div>
      );
  }
}
