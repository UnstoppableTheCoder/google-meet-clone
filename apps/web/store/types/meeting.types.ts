import { ActivePanel } from "@/types/meeting.types";
import { Participant, MediaOnPayload } from "@repo/types";

export interface State {
  currentParticipant: Participant | null;
  otherParticipants: Participant[];
  leftParticipants: Participant[];
  newlyJoinedParticipant: Participant | null;
  joiningParticipants: Participant[];
  leftParticipant: Participant | null;
  openModal: boolean;
  activePanel: ActivePanel;
  isEnded: boolean;
  pinnedId: string | null;
}

export interface Actions {
  setCurrentParticipant: (currentParticipant: Participant) => void;
  setHost: (newParticipant: Participant) => void;
  setOtherParticipants: (otherParticipants: Participant[]) => void;
  resetOtherParticipants: () => void;
  addNewParticipant: (newParticipant: Participant) => void;
  removeLeftParticipant: (leftParticipantId: string) => void;
  setLeftParticipant: (leftParticipant: Participant | null) => void;
  setNewlyJoinedParticipant: (newlyJoinedParticipant: Participant) => void;
  setJoiningParticipants: (joiningParticipant: Participant) => void;
  removeJoiningParticipant: (id: string) => void;
  resetJoiningParticipants: () => void;
  setOpenModal: (openModal: boolean) => void;
  setActivePanel: (activePanel: ActivePanel) => void;
  setOtherParticipantLocalCamera: (
    cameraOn: boolean,
    participantId: string,
  ) => void;
  setOtherParticipantLocalMic: (micOn: boolean, participantId: string) => void;
  setOtherParticipantHandRaise: (
    handRaised: boolean,
    handRaiserId: string,
  ) => void;
  setOtherParticipantRemoteMediaOn: (payload: MediaOnPayload) => void;
  setCurrentParticipantCamera: (cameraOn: boolean) => void;
  setCurrentParticipantMic: (micOn: boolean) => void;
  setCurrentParticipantHandRaise: (handRaised: boolean) => void;
  setIsEnded: (isEnded: boolean) => void;
  setPinnedId: (isPinnedId: string | null) => void;
  resetMeeting: () => void;
}
