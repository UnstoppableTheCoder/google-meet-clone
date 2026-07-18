import { labels, types } from "@repo/constants";
import { getWSConnection } from "./socket-manager";

export const handleSendHandRaise = (
  handRaise: boolean,
  handRaiserId: string,
  meetingId: string,
) => {
  const message = {
    label: labels.NORMAL_PROCESS,
    data: {
      type: types.HAND_RAISE,
      payload: {
        handRaise,
        handRaiserId,
        meetingId,
      },
    },
  };

  const ws = getWSConnection();
  ws.send(JSON.stringify(message));
};
