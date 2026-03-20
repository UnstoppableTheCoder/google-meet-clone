import React, { ReactNode } from "react";
import MeetingProvider from "./context/meeting-provider";

export default function MeetingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MeetingProvider>{children}</MeetingProvider>
    </>
  );
}
