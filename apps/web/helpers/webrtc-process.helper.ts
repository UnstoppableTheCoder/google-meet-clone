import {
  createPeerConnection,
  getPeerConnection,
  sendToSignalingServer,
} from "@/lib/peer-manager";
import { labels, types } from "@repo/constants";

const pendingIceCandidates: Record<string, RTCIceCandidate[]> = {};

export async function handleSDP_Process(payload: any, from: string) {
  const pc = getPeerConnection(from) ?? (await createPeerConnection(from));

  pendingIceCandidates[from] ??= [];

  switch (payload.type) {
    case "offer": {
      console.log("Offer");

      await pc.setRemoteDescription(payload.offer);

      while (pendingIceCandidates[from].length) {
        await pc.addIceCandidate(pendingIceCandidates[from].shift()!);
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      sendToSignalingServer(
        JSON.stringify({
          label: labels.WEBRTC_PROCESS,
          data: {
            type: types.SDP_PROCESS,
            payload: {
              type: "answer",
              answer: pc.localDescription,
            },
            to: from,
          },
        }),
      );

      break;
    }

    case "answer": {
      console.log("Answer");

      await pc.setRemoteDescription(payload.answer);

      while (pendingIceCandidates[from].length) {
        await pc.addIceCandidate(pendingIceCandidates[from].shift()!);
      }

      break;
    }

    case "ice-candidate": {
      console.log("ICE");

      if (!pc.remoteDescription) {
        pendingIceCandidates[from].push(payload.candidate);
      } else {
        await pc.addIceCandidate(payload.candidate);
      }

      break;
    }
  }
}
