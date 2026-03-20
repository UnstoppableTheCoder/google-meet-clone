import React, { RefObject } from "react";
import TopBar from "./top-bar";
import VideoGrid from "./video-grid";
import MediaControllers from "./media-controllers";

export default function VideoSection() {
  return (
    <div className="flex-1 flex flex-col">
      <TopBar />
      <VideoGrid />
      <MediaControllers />
    </div>
  );
}
