import { ActivePanel } from "@/types/meeting.types";
import { Participant } from "@repo/types";

export interface State {
  currentParticipant: Participant;
  otherParticipants: Participant[];
  newlyJoinedParticipant: Participant | null;
  joiningParticipants: Participant[];
  leftParticipant: Participant | null;
  openModal: boolean;
  activePanel: ActivePanel;
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
  setOtherParticipantCamera: (cameraOn: boolean, participantId: string) => void;
  setOtherParticipantMic: (micOn: boolean, participantId: string) => void;
  setCurrentParticipantCamera: (cameraOn: boolean) => void;
  setCurrentParticipantMic: (micOn: boolean) => void;
}
