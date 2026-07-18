export interface Participant {
  id: string;
  username: string;
  image: string;
  meetingId: string;
  meetingTitle: string;
  micOn?: boolean;
  cameraOn?: boolean;
  handRaise?: boolean;
  hasJoinedMeeting?: boolean;
  isHost: boolean;
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
