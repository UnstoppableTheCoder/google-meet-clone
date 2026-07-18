import { create } from "zustand";
import { Actions, State } from "./types/meeting.types";
import { Participant } from "@repo/types";
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

    setCurrentParticipant: (currentParticipant: Participant) =>
      set({ currentParticipant }),

    setHost: (host: Participant) => set({ currentParticipant: host }),

    setOtherParticipants: (otherParticipants: Participant[]) =>
      set((state) => ({
        otherParticipants: [...state.otherParticipants, ...otherParticipants],
      })),

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

    setOtherParticipantCamera: (cameraOn: boolean, participantId: string) =>
      set((state) => ({
        otherParticipants: state.otherParticipants.map((participant) =>
          participant.id === participantId
            ? { ...participant, cameraOn }
            : participant,
        ),
      })),

    setOtherParticipantMic: (micOn: boolean, participantId: string) =>
      set((state) => ({
        otherParticipants: state.otherParticipants.map((participant) =>
          participant.id === participantId
            ? { ...participant, micOn }
            : participant,
        ),
      })),

    setOtherParticipantHandRaise: (handRaise: boolean, handRaiserId: string) =>
      set((state) => {
        const otherParticipants = state.otherParticipants;

        const participant = otherParticipants.find(
          (p) => p.id === handRaiserId,
        );
        if (!participant) return { otherParticipants };

        participant.handRaise = handRaise;

        return { otherParticipants: [...otherParticipants] };
      }),

    setCurrentParticipantCamera: (cameraOn: boolean) =>
      set((state) => {
        const currentParticipant = state.currentParticipant;

        return {
          currentParticipant: { ...currentParticipant!, cameraOn },
        };
      }),

    setCurrentParticipantMic: (micOn: boolean) =>
      set((state) => {
        const currentParticipant = state.currentParticipant;

        return {
          currentParticipant: { ...currentParticipant!, micOn },
        };
      }),

    setCurrentParticipantHandRaise: (handRaise: boolean) =>
      set((state) => {
        const currentParticipant = state.currentParticipant;

        return {
          currentParticipant: { ...currentParticipant!, handRaise },
        };
      }),

    setIsEnded: (isEnded: boolean) => set({ isEnded }),

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
