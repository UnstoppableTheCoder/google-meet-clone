import WebSocket, { WebSocketServer } from "ws";
import { labels, types } from "@repo/constants";
import { connections, meetings } from "./store/state";
import {
  handleNormalProcess,
  handleWebRTCProcess,
} from "./handlers/process.handler";
// import url from "url";
import { URLSearchParams } from "url";
import { auth, type Session } from "@repo/auth";

const PORT = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });
let session: any;

wss.on("listening", () => {
  console.log(`WebSocket connection is listening on port: ${PORT}`);
});

wss.on("connection", async (ws: WebSocket, req) => {
  console.log("WS connection established successfully");

  // const params = url.parse(req.url || "", true).query;
  const params = new URLSearchParams(req.url?.split("?")[1]);
  const connectionId = params.get("id") || "";
  const meetingId = params.get("meetingId") || "";
  const token = params.get("token");

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);

  if (!connectionId) {
    console.log("connectionId is required");
    return;
  }

  if (!connections[connectionId]) {
    connections[connectionId] = ws;
  }

  ws.on("error", () => {
    return console.error;
  });

  ws.on("message", async (message) => {
    if (!session) {
      session = await auth.api.getSession({ headers });
    }

    if (!session) {
      console.log("Session doesn't exist");
      ws.close();
      return;
    }

    const parsedMessage = JSON.parse(message.toString());

    switch (parsedMessage.label) {
      case labels.NORMAL_PROCESS:
        handleNormalProcess(parsedMessage.data);
        break;

      case labels.WEBRTC_PROCESS:
        handleWebRTCProcess(parsedMessage.data, connectionId);
        break;

      default:
        console.log("Invalid Process Label: ", parsedMessage.label);
        break;
    }
  });

  ws.on("close", () => {
    console.log("Event: disconnect");
    const meeting = meetings[meetingId];
    if (!meeting) return;

    // Get the index of the left participant
    const leftParticipantIndex = meeting.participants.findIndex(
      (participant) => participant.id === connectionId,
    );

    // Get the left Participant
    const leftParticipant = meeting?.participants[leftParticipantIndex];
    if (!leftParticipant) {
      const hostId = meeting.host ? meeting.host.id : "";
      const ws = connections[hostId];
      const message = {
        label: labels.NORMAL_PROCESS,
        data: {
          type: types.NOT_REQUESTING_TO_JOIN_MEETING,
          payload: { id: connectionId },
        },
      };

      ws?.send(JSON.stringify(message));
      return;
    }

    // Remove the left participants from participants array
    meeting?.participants.splice(leftParticipantIndex, 1);

    // End the meeting
    if (meeting.participants.length === 0) {
      delete meetings[meetingId];
    }

    // handle host left
    if (leftParticipant?.isHost) {
      const newHost = meeting.participants[0];
      if (!newHost) return;

      newHost.isHost = true;
      meeting.host = newHost;

      // Inform the new host about himself
      const ws = connections[newHost.id];

      const message = {
        label: labels.NORMAL_PROCESS,
        data: {
          type: types.CONNECT_HOST,
          payload: { host: newHost },
        },
      };
      ws?.send(JSON.stringify(message));
    }

    // Inform others about the leftParticipant
    meeting.participants.forEach((participant) => {
      const ws = connections[participant.id];

      const message = {
        label: labels.NORMAL_PROCESS,
        data: {
          type: types.INFORM_OTHERS_ABOUT_LEFT_PARTICIPANT,
          payload: { leftParticipant },
        },
      };

      ws?.send(JSON.stringify(message));
    });
  });
});
