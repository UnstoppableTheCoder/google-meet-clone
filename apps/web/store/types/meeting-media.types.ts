type Reaction = { id: string; emoji: string; left: number };

export interface State {
  screenShare: boolean;
  isRecording: boolean;
  recordingStartedAt: number | null;
  remoteStreamVersion: number;
  reactions: Reaction[];

  localStream: MediaStream | null;
  screenStream: MediaStream | null;
}

export interface Actions {
  setScreenShare: (newState: boolean) => void;
  setRecording: (on: boolean) => void;
  setRemoteStreamVersion: () => void;
  resetMeetingMedia: () => void;
  setReaction: (id: string, emoji: string, left: number) => void;
  removeReaction: (id: string) => void;

  setLocalStream: (stream: MediaStream | null) => void;
  setScreenStream: (stream: MediaStream | null) => void;
}
