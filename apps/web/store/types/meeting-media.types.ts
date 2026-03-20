export interface State {
  screenShare: boolean;
  isRecording: boolean;
  remoteStreamVersion: number;
}

export interface Actions {
  setScreenShare: (newState: boolean) => void;
  setIsRecording: (newState: boolean) => void;
  setRemoteStreamVersion: () => void;
}
