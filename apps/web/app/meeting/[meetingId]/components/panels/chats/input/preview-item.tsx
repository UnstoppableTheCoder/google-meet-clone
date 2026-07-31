import { FileType } from "@repo/types";
import { FileText, FileArchive, FileQuestion } from "lucide-react";
import React from "react";

function Placeholder({ label, icon: Icon }: { label: string; icon: any }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-white/70 text-sm">
      <Icon className="w-8 h-8" />
      <span>{label}</span>
    </div>
  );
}

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
    case "image/png":
    case "image/jpeg":
    case "image/svg+xml":
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="h-full w-full object-contain"
        />
      );

    case "video/mp4":
    case "video/webm":
      return <video src={fileUrl} controls className="h-full w-full" />;

    case "application/pdf":
      return <Placeholder label="PDF preview unavailable" icon={FileText} />;

    case "application/zip":
      return <Placeholder label="ZIP preview unavailable" icon={FileArchive} />;

    default:
      return <Placeholder label="No preview" icon={FileQuestion} />;
  }
}
