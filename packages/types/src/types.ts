export interface Participant {
  id: string;
  username: string;
  avatar: string;
  meetingId: string;
  meetingTitle: string;
  isHost: boolean;
  isSelf?: boolean;
  micOn: boolean;
  cameraOn: boolean;
  handRaised: boolean;
  hasJoinedMeeting?: boolean;
  speaking?: boolean;
  hue?: number;
  initials?: string;
  localSettings?: {
    micOn?: boolean;
    cameraOn?: boolean;
  };
}

export type FileType =
  | "application/pdf"
  | "image/png"
  | "image/jpeg"
  | "image/svg+xml"
  | "video/mp4"
  | "video/webm"
  | "application/zip";

export type File = {
  fileName: string;
  fileType: FileType;
  fileUrl: string; // Todo: Change it to fileBlobUrl
};
