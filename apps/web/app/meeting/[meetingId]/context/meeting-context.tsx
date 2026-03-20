import { createContext } from "react";
import { MeetingContextType } from "./context.type";

export const MeetingContext = createContext<MeetingContextType | undefined>(
  undefined,
);
