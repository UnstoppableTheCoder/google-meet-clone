import type { File, Participant } from "@repo/types";
import { connections, meetings } from "../store/state";
import { labels, types } from "@repo/constants";

export function handleAskToConnect({
  newParticipant,
}: {
  newParticipant: Participant;
}) {
  console.log("Event: askToConnect");
  const { meetingId, id } = newParticipant;

  if (!meetings[meetingId]) {
    meetings[meetingId] = {
      host: null,
      participants: [],
    };
  }

  const meeting = meetings[meetingId];

  if (!meeting.host) {
    newParticipant.isHost = true;
    meeting.host = newParticipant;
    meeting.participants.push(newParticipant);

    // Inform the host about himself
    const ws = connections[id];
    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.CONNECT_HOST,
        payload: { host: newParticipant },
      },
    };

    // Notify the host about himself
    ws?.send(JSON.stringify(message));
    return;
  }

  // Notify the host about the joining of the new user
  const ws = connections[meeting.host.id];

  const message = {
    label: labels.NORMAL_PROCESS,
    data: {
      type: types.REQUEST_TO_JOIN_MEETING,
      payload: { newParticipant },
    },
  };

  ws?.send(JSON.stringify(message));
}

export function handleGrantJoiningPermission({
  granted,
  newParticipant,
}: {
  granted: boolean;
  newParticipant: Participant;
}) {
  console.log("Event: grantJoiningPermission");

  const meeting = meetings[newParticipant.meetingId];
  if (!meeting) {
    console.log("Meeting doesn't exist");
    return;
  }

  const otherParticipants: Participant[] = JSON.parse(
    JSON.stringify(meeting.participants),
  );

  if (granted) {
    meeting.participants.push(newParticipant);

    // Inform others about the new participant
    otherParticipants.forEach((participant) => {
      const ws = connections[participant.id];

      const message = {
        label: labels.NORMAL_PROCESS,
        data: {
          type: types.INFORM_OTHERS_ABOUT_NEW_PARTICIPANT,
          payload: { newParticipant },
        },
      };

      ws?.send(JSON.stringify(message));
    });

    // Inform new participant about others
    const ws = connections[newParticipant.id];
    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.INFORM_NEW_PARTICIPANT_ABOUT_OTHERS,
        payload: { otherParticipants, newParticipant },
      },
    };
    ws?.send(JSON.stringify(message));
  } else {
    // send deny message
    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.DENY_JOINING_MEETING,
        payload: { newParticipant },
      },
    };

    const ws = connections[newParticipant.id];
    ws?.send(JSON.stringify(message));
  }
}

export function handleSendMessage(payload: {
  senderId: string;
  meetingId: string;
  chatMessage: string;
  files: File[];
}) {
  const { meetingId, senderId } = payload;
  const meeting = meetings[meetingId];

  const otherParticipants = meeting?.participants.filter(
    (participant) => participant.id !== senderId,
  );

  otherParticipants?.forEach((participant) => {
    const ws = connections[participant.id];

    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.RECEIVE_MESSAGE,
        payload,
      },
    };

    ws?.send(JSON.stringify(message));
  });
}
