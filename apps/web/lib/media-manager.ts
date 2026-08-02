import { useMeeting } from "@/store/meeting";
import { useMeetingMedia } from "@/store/meeting-media";

let originalVideoTrack: MediaStreamTrack | null = null;

export async function createLocalStream() {
  const { localStream, setLocalStream } = useMeetingMedia.getState();
  const { currentParticipant } = useMeeting.getState();

  if (localStream) {
    return localStream;
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  originalVideoTrack = stream.getVideoTracks()[0] ?? null;

  const micEnabled = currentParticipant?.micOn ?? false;
  const cameraEnabled = currentParticipant?.cameraOn ?? false;

  stream.getAudioTracks().forEach((track) => {
    track.enabled = micEnabled;
  });

  stream.getVideoTracks().forEach((track) => {
    track.enabled = cameraEnabled;
  });

  setLocalStream(stream);

  return stream;
}

export async function createScreenStream() {
  try {
    const { setScreenStream } = useMeetingMedia.getState();

    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });

    setScreenStream(stream);

    return stream;
  } catch (error) {
    console.error("Rejected screen sharing", error);
    return null;
  }
}

export function resetScreenStream() {
  const { screenStream, setScreenStream } = useMeetingMedia.getState();

  screenStream?.getTracks().forEach((track) => track.stop());

  setScreenStream(null);
}

export function getOriginalVideoTrack() {
  return originalVideoTrack;
}

export function toggleMic(micOn: boolean) {
  const { localStream } = useMeetingMedia.getState();

  localStream?.getAudioTracks().forEach((track) => {
    track.enabled = micOn;
  });
}

export function toggleCamera(cameraOn: boolean) {
  const { localStream } = useMeetingMedia.getState();

  localStream?.getVideoTracks().forEach((track) => {
    track.enabled = cameraOn;
  });
}

export function stopLocalStream() {
  const { localStream, setLocalStream } = useMeetingMedia.getState();

  localStream?.getTracks().forEach((track) => track.stop());
  setLocalStream(null);
}
