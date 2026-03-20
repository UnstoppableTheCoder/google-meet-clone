"use client";

import React, { ReactNode, useRef } from "react";
import { MeetingContext } from "./meeting-context";

export default function MeetingProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket>(null);
  const panelsRef = useRef<HTMLDivElement | null>(null);
  const topBarChatBtnRef = useRef<HTMLButtonElement | null>(null);
  const topBarParticipantBtnRef = useRef<HTMLButtonElement | null>(null);
  const bottomBarChatBtnRef = useRef<HTMLButtonElement | null>(null);
  const bottomBarParticipantBtnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <MeetingContext.Provider
      value={{
        wsRef,
        panelsRef,
        topBarChatBtnRef,
        topBarParticipantBtnRef,
        bottomBarChatBtnRef,
        bottomBarParticipantBtnRef,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}
