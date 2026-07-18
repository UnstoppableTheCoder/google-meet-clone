import React, { RefObject } from "react";
import TopBar from "./top-bar";
import VideoGrid from "./video-grid";
import MediaControllers from "./media-controllers";

export default function VideoSection() {
  return (
    <div className="flex min-w-0 flex-1 flex-col bg-background">
      <TopBar />

      <main className="flex-1 overflow-hidden px-4 py-4 lg:px-6">
        <div className="h-full rounded-3xl border border-border bg-card shadow-xl">
          <VideoGrid />
        </div>
      </main>

      <footer className="border-t border-border bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <MediaControllers />
      </footer>
    </div>
  );
}
