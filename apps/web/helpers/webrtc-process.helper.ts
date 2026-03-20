import {
  createPeerConnection,
  getPeerConnection,
  sendToSignalingServer,
} from "@/lib/peer-manager";
import { labels, types } from "@repo/constants";

const pendingIceCandidates: RTCIceCandidate[] = [];

export async function handleSDP_Process(payload: any, from: string) {
  const pc = getPeerConnection(from) || (await createPeerConnection(from));

  switch (payload.type) {
    case "offer": {
      console.log("Event: Offer");
      pc.setRemoteDescription(payload.offer);

      pendingIceCandidates.forEach(async (candidate) => {
        await pc.addIceCandidate(candidate);
      });

      const answer = await pc.createAnswer();
      pc.setLocalDescription(answer);

      // send answer to the other peer
      const message = {
        label: labels.WEBRTC_PROCESS,
        data: {
          type: types.SDP_PROCESS,
          payload: { type: "answer", answer },
          to: from,
        },
      };

      sendToSignalingServer(JSON.stringify(message));
      console.log("answer created & sent to the other peer");
      break;
    }

    case "answer": {
      console.log("Event: answer");

      pc.setRemoteDescription(payload.answer);
      pendingIceCandidates.forEach(async (candidate) => {
        await pc.addIceCandidate(candidate);
      });
      break;
    }

    case "ice-candidate": {
      console.log("Event: ice-candidate");

      if (!pc.remoteDescription) {
        pendingIceCandidates.push(payload.candidate);
      } else {
        await pc.addIceCandidate(payload.candidate);
      }
      break;
    }

    default:
      console.log("Invalid type: ", payload.type);
      break;
  }
}
