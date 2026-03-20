import { labels, types } from "@repo/constants";
import { connections } from "../store/state";

export function handleSDP_Process(data: any, connectionId: string) {
  console.log("Event: handleSDP_Process");

  const message = {
    label: labels.WEBRTC_PROCESS,
    data: {
      type: types.SDP_PROCESS,
      payload: data.payload,
      from: connectionId,
    },
  };

  const ws = connections[data.to];
  ws?.send(JSON.stringify(message));
}
