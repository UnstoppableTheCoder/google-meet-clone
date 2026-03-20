import { useContext } from "react";
import { MeetingContext } from "./meeting-context";

export default function useMeetingContext() {
  const context = useContext(MeetingContext);

  if (!context) {
    console.log("useMeetingContext must be used inside MeetingProvider");
    return;
  }

  return context;
}
