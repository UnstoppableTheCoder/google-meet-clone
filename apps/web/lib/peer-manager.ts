import { useMeeting } from "@/store/meeting";
import { getWSConnection } from "./socket-manager";
import { labels, types } from "@repo/constants";
import {
  createLocalStream,
  createScreenStream,
  getOriginalVideoTrack,
  resetScreenStream,
} from "./media-manager";
import { useMeetingMedia } from "@/store/meeting-media";
import { PeerConnections, RemoteStreams, RTPSenders } from "./types/lib.types";
import { handleSendMediaOn } from "./media-on";

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

export async function createPeerConnection1(id: string) {
  console.log("Message: Creating Peer Connection");

  let { localStream, screenStream } = useMeetingMedia.getState();

  const pc = new RTCPeerConnection(rtcConfig);
  peerConnections[id] = pc;

  if (!localStream) {
    localStream = await createLocalStream();
  }

  rtpSenders[id] = {};
  localStream?.getTracks().forEach((track) => {
    rtpSenders[id]![track.kind as "audio" | "video"] = pc.addTrack(
      track,
      localStream,
    );
  });

  if (screenStream) {
    await rtpSenders[id]?.video?.replaceTrack(screenStream.getTracks()[0]!);
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
    await pc.setLocalDescription(offer);

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

export async function createPeerConnection(id: string) {
  console.log("Creating Peer Connection:", id);

  let { localStream, screenStream } = useMeetingMedia.getState();

  if (!localStream) {
    localStream = await createLocalStream();
  }

  const pc = new RTCPeerConnection(rtcConfig);
  peerConnections[id] = pc;

  pc.onicecandidate = (event) => {
    if (!event.candidate) return;

    sendToSignalingServer(
      JSON.stringify({
        label: labels.WEBRTC_PROCESS,
        data: {
          type: types.SDP_PROCESS,
          payload: {
            type: "ice-candidate",
            candidate: event.candidate,
          },
          to: id,
        },
      }),
    );
  };

  pc.ontrack = (event) => {
    const stream = event.streams[0];
    if (!stream) return;

    remoteStreams[id] = stream;
    useMeetingMedia.getState().setRemoteStreamVersion();
  };

  pc.onnegotiationneeded = async () => {
    try {
      const currentParticipant = useMeeting.getState().currentParticipant;
      const newlyJoinedParticipant =
        useMeeting.getState().newlyJoinedParticipant;

      if (!currentParticipant || !newlyJoinedParticipant) return;

      if (currentParticipant.id === newlyJoinedParticipant.id) {
        console.log("Skipping offer creation");
        return;
      }

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      sendToSignalingServer(
        JSON.stringify({
          label: labels.WEBRTC_PROCESS,
          data: {
            type: types.SDP_PROCESS,
            payload: {
              type: "offer",
              offer: pc.localDescription,
            },
            to: id,
          },
        }),
      );

      console.log("Offer sent");
    } catch (err) {
      console.error("Negotiation failed:", err);
    }
  };

  rtpSenders[id] = {};

  // Add tracks
  for (const track of localStream.getTracks()) {
    rtpSenders[id][track.kind as "audio" | "video"] = pc.addTrack(
      track,
      localStream,
    );
  }

  // Replace with screen share if active
  if (screenStream) {
    const screenTrack = screenStream.getVideoTracks()[0];
    if (screenTrack) {
      await rtpSenders[id].video?.replaceTrack(screenTrack);
    }
  }

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
    startSharingScreen();
  } else {
    stopSharingScreen();
  }
}

export function sendToSignalingServer(message: string) {
  const ws = getWSConnection();
  ws.send(message);
}

async function startSharingScreen() {
  const screenStream = await createScreenStream();
  if (!screenStream) return;

  const screenTrack = screenStream.getVideoTracks()[0];
  if (!screenTrack) return;

  for (const senderInfo of Object.values(rtpSenders)) {
    await senderInfo.video?.replaceTrack(screenTrack);
  }

  screenTrack.onended = () => {
    stopSharingScreen();
  };

  // Change the state
  useMeetingMedia.getState().setScreenShare(true);
}

async function stopSharingScreen() {
  const currentParticipant = useMeeting.getState().currentParticipant;
  if (!currentParticipant) return;

  const originalVideoTrack = getOriginalVideoTrack();

  for (const senderInfo of Object.values(rtpSenders)) {
    await senderInfo.video?.replaceTrack(originalVideoTrack);
  }

  resetScreenStream();

  // Change the state
  useMeetingMedia.getState().setScreenShare(false);
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
