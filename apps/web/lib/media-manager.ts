let localStream: MediaStream | null;
let screenStream: MediaStream | null;
let originalVideoTrack: MediaStreamTrack | null;

export async function createLocalStream() {
  if (!localStream) {
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  }

  if (!localStream) {
    console.log("LocalStream is not available");
    return;
  }

  originalVideoTrack = localStream.getVideoTracks()[0]!;

  localStream.getTracks().forEach((track) => {
    track.enabled = false;
  });

  return localStream;
}

export const getLocalStream = () => localStream;

export const createScreenStream = async () => {
  try {
    screenStream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });

    if (!screenStream) {
      console.log("No Screen Share Stream");
      return;
    }

    return screenStream;
  } catch (error) {
    console.log("Reject to share the screen");
  }
};

export const getScreenStream = () => {
  if (!screenStream) {
    console.log("No screen stream");
    return;
  }

  return screenStream;
};

export const resetScreenStream = () => {
  screenStream?.getTracks().forEach((track) => track.stop());
  screenStream = null;
};

export const getOriginalVideoTrack = () => originalVideoTrack;

export const toggleMic = (micOn: boolean) => {
  localStream?.getAudioTracks().forEach((track) => {
    track.enabled = micOn;
  });
};

export const toggleCamera = (cameraOn: boolean) => {
  localStream?.getVideoTracks().forEach((track) => {
    track.enabled = cameraOn;
  });
};
