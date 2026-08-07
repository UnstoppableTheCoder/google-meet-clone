"use client";

import React, { ReactNode, useRef } from "react";
import { MeetingContext } from "./meeting-context";

export default function MeetingProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket>(null);

  return (
    <MeetingContext.Provider
      value={{
        wsRef,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}
