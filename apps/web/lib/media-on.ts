import { labels, types } from "@repo/constants";
import { getWSConnection } from "./socket-manager";

export const handleSendMediaOn = (
  cameraOn: boolean,
  micOn: boolean,
  participantId: string,
  meetingId: string,
) => {
  const message = {
    label: labels.NORMAL_PROCESS,
    data: {
      type: types.MEDIA_ON,
      payload: {
        cameraOn,
        micOn,
        participantId,
        meetingId,
      },
    },
  };

  const ws = getWSConnection();

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.warn("Socket not connected");
    return;
  }

  ws.send(JSON.stringify(message));
};
