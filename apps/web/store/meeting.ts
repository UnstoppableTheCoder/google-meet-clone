import { create } from "zustand";
import { Actions, State } from "./types/meeting.types";
import { Participant, MediaOnPayload } from "@repo/types";
import { ActivePanel } from "@/types/meeting.types";
import { devtools } from "zustand/middleware";

export const useMeeting = create<State & Actions>()(
  devtools((set) => ({
    currentParticipant: null,
    otherParticipants: [],
    leftParticipants: [],
    newlyJoinedParticipant: null,
    joiningParticipants: [],
    leftParticipant: null,
    openModal: false,
    activePanel: "none",
    isEnded: false,
    pinnedId: null,

    setCurrentParticipant: (currentParticipant: Participant) =>
      set({ currentParticipant }),

    setHost: (host: Participant) => set({ currentParticipant: host }),

    setOtherParticipants: (otherParticipants: Participant[]) =>
      set((state) => {
        const existingIds = new Set(
          state.otherParticipants.map((participant) => participant.id),
        );

        return {
          otherParticipants: [
            ...state.otherParticipants,
            ...otherParticipants.filter(
              (participant) => !existingIds.has(participant.id),
            ),
          ],
        };
      }),

    resetOtherParticipants: () => set({ otherParticipants: [] }),

    addNewParticipant: (newParticipant: Participant) =>
      set((state) => ({
        otherParticipants: [...state.otherParticipants, newParticipant],
      })),

    removeLeftParticipant: (leftParticipantId: string) =>
      set((state) => {
        return {
          otherParticipants: state.otherParticipants.filter(
            (participant) => participant.id !== leftParticipantId,
          ),
        };
      }),

    setLeftParticipant: (leftParticipant: Participant) => {
      if (!leftParticipant) return;

      set({ leftParticipant });
      set((state) => ({
        leftParticipants: [...state.leftParticipants, leftParticipant],
      }));
    },

    setNewlyJoinedParticipant: (newlyJoinedParticipant: Participant) =>
      set({ newlyJoinedParticipant }),

    setJoiningParticipants: (joiningParticipant: Participant) => {
      set((state) => ({
        joiningParticipants: [...state.joiningParticipants, joiningParticipant],
      }));
    },

    removeJoiningParticipant: (id: string) =>
      set((state) => ({
        joiningParticipants: state.joiningParticipants.filter(
          (participant) => participant.id !== id,
        ),
      })),

    resetJoiningParticipants: () => set({ joiningParticipants: [] }),

    setOpenModal: (openModal: boolean) => set({ openModal }),

    setActivePanel: (activePanel: ActivePanel) => set({ activePanel }),

    setOtherParticipantLocalCamera: (
      cameraOn: boolean,
      participantId: string,
    ) =>
      set((state) => ({
        otherParticipants: state.otherParticipants.map((participant) =>
          participant.id === participantId
            ? {
                ...participant,
                localSettings: { ...participant.localSettings, cameraOn },
              }
            : participant,
        ),
      })),

    setOtherParticipantLocalMic: (micOn: boolean, participantId: string) =>
      set((state) => {
        return {
          otherParticipants: state.otherParticipants.map((participant) =>
            participant.id === participantId
              ? {
                  ...participant,
                  localSettings: { ...participant.localSettings, micOn },
                }
              : participant,
          ),
        };
      }),

    setOtherParticipantHandRaise: (handRaised: boolean, handRaiserId: string) =>
      set((state) => {
        const otherParticipants = state.otherParticipants;

        const participant = otherParticipants.find(
          (p) => p.id === handRaiserId,
        );
        if (!participant) return { otherParticipants };

        participant.handRaised = handRaised;

        return { otherParticipants: [...otherParticipants] };
      }),

    setOtherParticipantRemoteMediaOn: ({
      micOn,
      cameraOn,
      participantId,
      meetingId,
    }: MediaOnPayload) =>
      set((state) => ({
        otherParticipants: state.otherParticipants.map((participant) =>
          participant.id === participantId
            ? { ...participant, micOn, cameraOn }
            : participant,
        ),
      })),

    setCurrentParticipantCamera: (cameraOn: boolean) =>
      set((state) => {
        const currentParticipant = state.currentParticipant;

        return {
          currentParticipant: {
            ...currentParticipant!,
            cameraOn,
            localSettings: { ...currentParticipant?.localSettings, cameraOn },
          },
        };
      }),

    setCurrentParticipantMic: (micOn: boolean) =>
      set((state) => {
        const currentParticipant = state.currentParticipant;

        return {
          currentParticipant: {
            ...currentParticipant!,
            micOn,
            localSettings: { ...currentParticipant?.localSettings, micOn },
          },
        };
      }),

    setCurrentParticipantHandRaise: (handRaised: boolean) =>
      set((state) =>
        state.currentParticipant
          ? {
              currentParticipant: {
                ...state.currentParticipant,
                handRaised,
              },
            }
          : {},
      ),

    setIsEnded: (isEnded: boolean) => set({ isEnded }),

    setPinnedId: (pinnedId: string | null) => set({ pinnedId }),

    resetMeeting: () => {
      set({
        currentParticipant: null,
        otherParticipants: [],
        leftParticipants: [],
        newlyJoinedParticipant: null,
        joiningParticipants: [],
        leftParticipant: null,
        openModal: false,
        activePanel: "none",
        isEnded: false,
      });
    },
  })),
);
