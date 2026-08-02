import { labels, types } from "@repo/constants";
import { getWSConnection } from "./socket-manager";

export const handleSendEmoji = (
  reaction: string,
  participantId: string,
  meetingId: string,
) => {
  const message = {
    label: labels.NORMAL_PROCESS,
    data: {
      type: types.EMOJI_REACTION,
      payload: {
        reaction,
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
