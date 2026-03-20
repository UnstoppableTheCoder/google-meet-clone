import React, { RefObject } from "react";
import ParticipantPanel from "./participants/participants-panel";
import ChatPanel from "./chats/chat-panel";
import useMeetingContext from "../../context/use-meeting-context";

export default function Panels() {
  const context = useMeetingContext();
  if (!context) return;
  const { panelsRef } = context;

  return (
    <div className="flex" ref={panelsRef}>
      <ChatPanel />
      <ParticipantPanel />
    </div>
  );
}
