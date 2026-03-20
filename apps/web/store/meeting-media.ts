import { create } from "zustand";
import { Actions, State } from "./types/meeting-media.types";
import { devtools } from "zustand/middleware";

export const useMeetingMedia = create<State & Actions>()(
  devtools((set) => ({
    screenShare: false,
    isRecording: false,
    remoteStreamVersion: 0,

    setScreenShare: (newState: boolean) =>
      set({ screenShare: newState }, false, "/meeting-media/screenShare"),
    setIsRecording: (newState: boolean) =>
      set({ isRecording: newState }, false, "/meeting-media/isRecording"),
    setRemoteStreamVersion: () =>
      set(
        (state) => {
          console.log("Changing the stream version");
          return { remoteStreamVersion: state.remoteStreamVersion + 1 };
        },
        false,
        "/meeting-media/remoteStreamVersion",
      ),
  })),
);
