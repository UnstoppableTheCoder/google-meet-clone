import { Card, CardContent } from "@repo/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/components/carousel";
import * as React from "react";
import PreviewItem from "./preview-item";
import { File } from "@repo/types";
import { v4 as uuidv4 } from "uuid";

export function PreviewCarousel({ files }: { files: File[] }) {
  if (files.length === 0) return;

  const [selectedFile, setSelectedFile] = React.useState<File>();

  // File at the 0 index, will be selected by default
  React.useEffect(() => {
    setSelectedFile(files[0]);
  }, [files]);

  if (!selectedFile) return;

  return (
    <div className="bg-gray-600 rounded-lg px-1">
      <div className="h-50 w-full text-center rounded-lg p-3">
        <PreviewItem
          fileName={selectedFile.fileName}
          fileType={selectedFile.fileType}
          fileUrl={selectedFile.fileUrl}
        />
      </div>
      <Carousel className="w-full text-black">
        <CarouselContent className="-ml-1">
          {files.map((file, index) => (
            <CarouselItem
              key={uuidv4()}
              className="pl-1 basis-2/7 h-20"
              onClick={() => setSelectedFile(file)}
            >
              <div className="p-1 h-full">
                <Card className="h-full">
                  <CardContent className="flex h-full aspect-square items-center justify-center p-6">
                    {file.fileType.split("/")[1]?.toUpperCase()}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
