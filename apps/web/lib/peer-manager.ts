import { useMeeting } from "@/store/meeting";
import { getWSConnection } from "./socket-manager";
import { labels, types } from "@repo/constants";
import {
  createScreenStream,
  getLocalStream,
  getOriginalVideoTrack,
  getScreenStream,
  resetScreenStream,
} from "./media-manager";
import { useMeetingMedia } from "@/store/meeting-media";
import { PeerConnections, RemoteStreams, RTPSenders } from "./types/lib.types";

const peerConnections: PeerConnections = {};
const rtpSenders: RTPSenders = {};
const remoteStreams: RemoteStreams = {};
let mediaRecorder: MediaRecorder;
let recordingChunks: Blob[] = [];

const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
  ],
};

export async function createPeerConnection(id: string) {
  console.log("Message: Creating Peer Connection");
  const pc = new RTCPeerConnection(rtcConfig);
  peerConnections[id] = pc;

  const localStream = getLocalStream();

  if (localStream) {
    localStream?.getTracks().forEach((track) => {
      rtpSenders[id] = {};
      rtpSenders[id][track.kind as "audio" | "video"] = pc.addTrack(
        track,
        localStream,
      );
    });
  }

  const screenStream = getScreenStream();
  if (screenStream) {
    rtpSenders[id]?.video?.replaceTrack(screenStream.getTracks()[0]!);
  }

  pc.onnegotiationneeded = async () => {
    const currentParticipant = useMeeting.getState().currentParticipant;
    const newlyJoinedParticipant = useMeeting.getState().newlyJoinedParticipant;

    if (!currentParticipant || !newlyJoinedParticipant) return;
    if (currentParticipant.id === newlyJoinedParticipant.id) {
      console.log("Skipping offer creation for newly joined participant");
      return;
    }

    const offer = await pc.createOffer();
    pc.setLocalDescription(offer);

    // send the offer to the other peer
    const message = {
      label: labels.WEBRTC_PROCESS,
      data: {
        type: types.SDP_PROCESS,
        payload: { type: "offer", offer },
        to: id,
      },
    };

    sendToSignalingServer(JSON.stringify(message));

    console.log("Offer created and sent to the other peer");
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      const message = {
        label: labels.WEBRTC_PROCESS,
        data: {
          type: types.SDP_PROCESS,
          payload: { type: "ice-candidate", candidate: event.candidate },
          to: id,
        },
      };

      sendToSignalingServer(JSON.stringify(message));
      console.log("candidates created & sent to the other peer");
    }
  };

  pc.ontrack = (event) => {
    const stream = event.streams[0];
    if (!stream) return;
    remoteStreams[id] = stream;
    useMeetingMedia.getState().setRemoteStreamVersion();
  };

  return pc;
}

export function getPeerConnection(id: string) {
  return peerConnections[id];
}

export function getRemoteStream(id: string) {
  return remoteStreams[id];
}

export function handleScreenShare(screenShare: boolean) {
  if (screenShare) {
    startSharingScreen(screenShare);
  } else {
    stopSharingScreen(screenShare);
  }
}

export function sendToSignalingServer(message: string) {
  const ws = getWSConnection();
  ws.send(message);
}

async function startSharingScreen(screenShare: boolean) {
  const screenStream = await createScreenStream();
  if (!screenStream) return;

  const screenTrack = screenStream.getVideoTracks()[0];
  if (!screenTrack) return;

  for (const senderInfo of Object.values(rtpSenders)) {
    senderInfo.video?.replaceTrack(screenTrack);
  }

  screenTrack.onended = () => {
    stopSharingScreen(screenShare);
  };

  // Change the state
  useMeetingMedia.getState().setScreenShare(screenShare);
}

function stopSharingScreen(screenShare: boolean) {
  const originalVideoTrack = getOriginalVideoTrack();

  for (const senderInfo of Object.values(rtpSenders)) {
    senderInfo.video?.replaceTrack(originalVideoTrack);
  }

  resetScreenStream();

  // Change the state
  useMeetingMedia.getState().setScreenShare(!screenShare);
}

export function handleIsRecording(isRecording: boolean) {
  if (isRecording) {
    startRecording(isRecording);
  } else {
    stopRecording(isRecording);
  }
}

async function startRecording(isRecording: boolean) {
  // stream -> screen video + audio + my audio
  const screenStream = await createScreenStream();
  if (!screenStream) return;
  const localAudioStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });

  const recordingStream = new MediaStream([
    ...screenStream.getTracks(),
    ...localAudioStream.getTracks(),
  ]);

  mediaRecorder = new MediaRecorder(recordingStream);
  mediaRecorder.start();

  mediaRecorder.ondataavailable = (e) => {
    recordingChunks.push(e.data);
  };

  mediaRecorder.onstop = (e) => {
    recordingStream.getTracks().forEach((track) => track.stop());

    const clipName = prompt("Enter the name of the video: ") || "new recording";

    const blob = new Blob(recordingChunks, { type: "video/mp4" });
    recordingChunks = [];

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.download = clipName + ".mp4";
    a.click();
    document.appendChild(a); // may need to change the sequence

    URL.revokeObjectURL(url);
    document.removeChild(a);
  };

  const recordingVideoTrack = recordingStream.getVideoTracks()[0];
  if (!recordingVideoTrack) return;
  recordingVideoTrack.onended = () => {
    stopRecording(!isRecording);
  };

  // Change the state
  useMeetingMedia.getState().setIsRecording(isRecording);
}

function stopRecording(isRecording: boolean) {
  mediaRecorder.stop();
  useMeetingMedia.getState().setIsRecording(isRecording);
}
