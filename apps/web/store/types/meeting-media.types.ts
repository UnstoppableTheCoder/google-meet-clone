export interface State {
  screenShare: boolean;
  isRecording: boolean;
  remoteStreamVersion: number;

  localStream: MediaStream | null;
  screenStream: MediaStream | null;
}

export interface Actions {
  setScreenShare: (newState: boolean) => void;
  setIsRecording: (newState: boolean) => void;
  setRemoteStreamVersion: () => void;
  resetMeetingMedia: () => void;

  setLocalStream: (stream: MediaStream | null) => void;
  setScreenStream: (stream: MediaStream | null) => void;
}
