export interface PeerConnections {
  [id: string]: RTCPeerConnection;
}

export interface RTPSenders {
  [id: string]: {
    audio?: RTCRtpSender | null;
    video?: RTCRtpSender | null;
  };
}

export interface RemoteStreams {
  [id: string]: MediaStream;
}
