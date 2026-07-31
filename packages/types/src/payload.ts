import type { File, Participant } from "./types";

export interface HandRaisePayload {
  handRaise: boolean;
  handRaiserId: string;
  meetingId: string;
}

export interface MediaOnPayload {
  cameraOn: boolean;
  micOn: boolean;
  participantId: string;
  meetingId: string;
}

export interface ChatPayload {
  _id: string;
  senderId: string;
  sendTo: string;
  meetingId: string;
  chatMessage: string;
  files: File[];
  createdAt?: Date;
}

export interface LeaveMeetingPayload {
  leftParticipant: Participant;
}
