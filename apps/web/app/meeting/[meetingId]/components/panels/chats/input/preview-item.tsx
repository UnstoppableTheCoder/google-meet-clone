import { FileType } from "@repo/types";
import React from "react";

export default function PreviewItem({
  fileName,
  fileType,
  fileUrl,
}: {
  fileName: string;
  fileType: FileType;
  fileUrl: string;
}) {
  switch (fileType) {
    case "application/pdf":
      return (
        <div className="h-full w-full bg-gray-500 flex justify-center items-center text-white text-bold text-2xl rounded-lg">
          No PDF Preview Available
        </div>
      );

    case "image/png":
      return (
        <div className="h-full w-full flex items-center justify-center">
          <img src={fileUrl} alt="Preview Image" className="h-full" />
        </div>
      );

    case "image/jpeg":
      return (
        <div className="h-full w-full flex items-center justify-center">
          <img src={fileUrl} alt="Preview Image" className="h-full" />
        </div>
      );

    case "image/svg+xml":
      return (
        <div className="h-full w-full flex items-center justify-center">
          <img src={fileUrl} alt="Preview Image" className="h-full" />
        </div>
      );

    case "video/mp4":
      return (
        <div className="h-full w-full flex items-center">
          <video src={fileUrl} controls></video>
        </div>
      );

    case "video/webm":
      return (
        <div className="h-full w-full flex items-center">
          <video src={fileUrl} controls></video>
        </div>
      );

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
