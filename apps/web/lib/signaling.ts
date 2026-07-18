import { labels, types } from "@repo/constants";
import { useMeeting } from "@/store/meeting";
import {
  handleNormalProcess,
  handleWebRTCProcess,
} from "../handlers/process.handler";

export const signaling = (ws: WebSocket) => {
  ws.onopen = () => {
    const currentParticipant = useMeeting.getState().currentParticipant;
    console.log("WS connection established successfully");
    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.ASK_TO_CONNECT,
        payload: { newParticipant: currentParticipant },
      },
    };

    ws.send(JSON.stringify(message));
    console.log("Sent ask_to_connect");
  };

  ws.onmessage = (event) => {
    const parsedMessage = JSON.parse(event.data.toString());

    switch (parsedMessage.label) {
      case labels.NORMAL_PROCESS:
        handleNormalProcess(parsedMessage.data);
        break;

      case labels.WEBRTC_PROCESS:
        handleWebRTCProcess(parsedMessage.data);
        break;

      default:
        console.log("Invalid Process Label: ", parsedMessage.label);
        break;
    }
  };

  ws.onerror = (event) => {
    console.log(event);
    console.log("Error connecting to websocket");
  };

  ws.onclose = async () => {
    console.log("Web socket connection closed");
    const currentParticipant = useMeeting.getState().currentParticipant;
    if (!currentParticipant) return;
  };
};
