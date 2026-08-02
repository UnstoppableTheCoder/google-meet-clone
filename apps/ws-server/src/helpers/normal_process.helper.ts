import type {
  ChatPayload,
  HandRaisePayload,
  LeaveMeetingPayload,
  MediaOnPayload,
  EmojiReactionPayload,
  Participant,
} from "@repo/types";
import { connections, meetings } from "../store/state";
import { labels, types } from "@repo/constants";
import {
  handleIsAlreadyParticipant,
  informNewParticipantAboutOthers,
  informOthersAboutLeftParticipant,
  informOthersAboutNewParticipant,
} from "../services/socket.service";

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
  console.log("MEETINGS ask to connect: ", meeting.host);
  console.log("Participants: ", meeting.participants);

  const isAlreadyParticipant = meeting.participants.some((p) => p.id === id);
  if (isAlreadyParticipant) {
    handleIsAlreadyParticipant(newParticipant, meeting);
    return;
  }

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
    console.log("Connect host event sent");
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
    informOthersAboutNewParticipant(otherParticipants, newParticipant);

    // Inform new participant about others
    informNewParticipantAboutOthers(otherParticipants, newParticipant);
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

export function handleSendMessage(payload: ChatPayload) {
  const { meetingId, senderId, sendTo } = payload;
  const meeting = meetings[meetingId];

  if (sendTo === "everyone") {
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
  } else {
    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.RECEIVE_MESSAGE,
        payload,
      },
    };

    const ws = connections[sendTo];

    ws?.send(JSON.stringify(message));
  }
}

export function handleHandRaise(payload: HandRaisePayload) {
  const { handRaiserId, meetingId } = payload;

  const meeting = meetings[meetingId];
  if (!meeting) return;

  const otherParticipants = meeting.participants.filter(
    (p) => p.id !== handRaiserId,
  );

  otherParticipants.forEach((participant) => {
    const ws = connections[participant.id];

    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.HAND_RAISE,
        payload,
      },
    };

    ws?.send(JSON.stringify(message));
  });
}

export function handleMediaOn(payload: MediaOnPayload) {
  const { participantId, meetingId, cameraOn, micOn } = payload;

  const meeting = meetings[meetingId];
  if (!meeting) return;

  const participant = meeting.participants.find((p) => p.id === participantId);
  if (!participant) return;

  // No changes
  if (participant.cameraOn === cameraOn && participant.micOn === micOn) {
    return;
  }

  // Update authoritative state
  participant.cameraOn = cameraOn;
  participant.micOn = micOn;

  if (participant.isHost && meeting.host) {
    meeting.host.cameraOn = cameraOn;
    meeting.host.micOn = micOn;
  }

  // Broadcast the updated state
  const message = JSON.stringify({
    label: labels.NORMAL_PROCESS,
    data: {
      type: types.MEDIA_ON,
      payload: {
        participantId,
        meetingId,
        cameraOn: participant.cameraOn,
        micOn: participant.micOn,
      },
    },
  });

  meeting.participants.forEach((p) => {
    if (p.id === participantId) return;

    connections[p.id]?.send(message);
  });
}

export function handleEmojiReaction(payload: EmojiReactionPayload) {
  const { participantId, meetingId } = payload;

  const meeting = meetings[meetingId];
  if (!meeting) return;

  const participant = meeting.participants.find((p) => p.id === participantId);
  if (!participant) return;

  // Broadcast the updated state
  const message = JSON.stringify({
    label: labels.NORMAL_PROCESS,
    data: {
      type: types.EMOJI_REACTION,
      payload,
    },
  });

  meeting.participants.forEach((p) => {
    if (p.id === participantId) return;

    connections[p.id]?.send(message);
  });
}

export function handleLeaveMeeting({ leftParticipant }: LeaveMeetingPayload) {
  const meetingId = leftParticipant.meetingId;
  const meeting = meetings[meetingId];
  if (!meeting) return;

  // Get the index of the left participant
  const leftParticipantIndex = meeting.participants.findIndex(
    (participant) => participant.id === leftParticipant.id,
  );

  // Remove the left participants from participants array
  meeting?.participants.splice(leftParticipantIndex, 1);

  // Remove Left Participants connection
  delete connections[leftParticipant.id];

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
  informOthersAboutLeftParticipant(meeting, leftParticipant);
}

export function handleEndMeeting({
  participant,
}: {
  participant: Participant;
}) {
  if (!participant.isHost) return;

  const meetingId = participant.meetingId;
  const meeting = meetings[meetingId];

  meeting?.participants.forEach((p) => {
    if (p.id === participant.id) {
      delete connections[p.id];
      return;
    }

    const participantId = p.id;
    const ws = connections[participantId];
    if (!ws) return;

    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.END_MEETING,
        payload: null,
      },
    };

    ws.send(JSON.stringify(message));
    delete connections[participantId];
  });

  delete meetings[meetingId];
}
