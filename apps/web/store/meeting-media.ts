import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Actions, State } from "./types/meeting-media.types";

export const useMeetingMedia = create<State & Actions>()(
  devtools((set) => ({
    localStream: null,
    screenStream: null,

    screenShare: false,
    isRecording: false,
    remoteStreamVersion: 0,

    setLocalStream: (stream) =>
      set({ localStream: stream }, false, "/meeting-media/localStream"),

    setScreenStream: (stream) =>
      set({ screenStream: stream }, false, "/meeting-media/screenStream"),

    setScreenShare: (newState) =>
      set({ screenShare: newState }, false, "/meeting-media/screenShare"),

    setIsRecording: (newState) =>
      set({ isRecording: newState }, false, "/meeting-media/isRecording"),

    setRemoteStreamVersion: () =>
      set(
        (state) => ({
          remoteStreamVersion: state.remoteStreamVersion + 1,
        }),
        false,
        "/meeting-media/remoteStreamVersion",
      ),

    resetMeetingMedia: () =>
      set(
        {
          localStream: null,
          screenStream: null,
          screenShare: false,
          isRecording: false,
          remoteStreamVersion: 0,
        },
        false,
        "/meeting-media/reset",
      ),
  })),
);
