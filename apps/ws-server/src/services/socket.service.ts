import type { Participant } from "@repo/types";
import { connections } from "../store/state";
import { labels, types } from "@repo/constants";
import type { Meeting } from "../ws.types";

export function informOthersAboutNewParticipant(
  otherParticipants: Participant[],
  newParticipant: Participant,
) {
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
}

export function informNewParticipantAboutOthers(
  otherParticipants: Participant[],
  newParticipant: Participant,
) {
  const ws = connections[newParticipant.id];
  const message = {
    label: labels.NORMAL_PROCESS,
    data: {
      type: types.INFORM_NEW_PARTICIPANT_ABOUT_OTHERS,
      payload: { otherParticipants, newParticipant },
    },
  };
  ws?.send(JSON.stringify(message));
}

export function handleIsAlreadyParticipant(
  participant: Participant,
  meeting: Meeting,
) {
  const otherParticipants = meeting.participants.filter(
    (p) => p.id !== participant.id,
  );

  const newParticipant = meeting.participants.find(
    (p) => p.id === participant.id,
  );
  if (!newParticipant) return;

  if (meeting.host?.id === newParticipant.id) {
    // participant.isHost = true;

    const ws = connections[newParticipant.id];
    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.CONNECT_HOST,
        payload: { host: newParticipant },
      },
    };

    // Notify the host about himself
    ws?.send(JSON.stringify(message));
  }

  // Inform others about the participant
  informOthersAboutNewParticipant(otherParticipants, newParticipant);

  // inform the participant about others
  informNewParticipantAboutOthers(otherParticipants, newParticipant);
}

export function informOthersAboutLeftParticipant(
  meeting: Meeting,
  leftParticipant: Participant,
) {
  for (const participant of meeting.participants) {
    if (participant.id === leftParticipant.id) {
      continue;
    }

    const ws = connections[participant.id];

    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.INFORM_OTHERS_ABOUT_LEFT_PARTICIPANT,
        payload: { leftParticipant },
      },
    };

    ws?.send(JSON.stringify(message));
  }
}
