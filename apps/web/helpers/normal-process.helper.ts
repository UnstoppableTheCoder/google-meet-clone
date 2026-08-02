import {
  ChatPayload,
  HandRaisePayload,
  Participant,
  MediaOnPayload,
  EmojiReactionPayload,
} from "@repo/types";
import { useMeeting } from "../store/meeting";
import { getWSConnection } from "@/lib/socket-manager";
import { redirect } from "next/navigation";
import { createPeerConnection } from "@/lib/peer-manager";
import { useChat } from "@/store/chat";
import {
  deleteMeetingHistory,
  saveEndMeetingHistory,
} from "@/actions/meeting.action";
import { useMeetingMedia } from "@/store/meeting-media";

const reactionTimers = new Map();

export function handleConnectHost({ host }: { host: Participant }) {
  console.log("Event: connectHost");

  const setHost = useMeeting.getState().setHost;
  setHost({
    ...host,
    hasJoinedMeeting: true,
  });
}

export function handleRequestToJoinMeeting({
  newParticipant,
}: {
  newParticipant: Participant;
}) {
  console.log("Event: requestToJoinMeeting");

  const { setOpenModal, setJoiningParticipants } = useMeeting.getState();
  setOpenModal(true);
  setJoiningParticipants(newParticipant);
}

export function handleNotRequestingToJoinMeeting({ id }: { id: string }) {
  const removeJoiningParticipant =
    useMeeting.getState().removeJoiningParticipant;

  removeJoiningParticipant(id);
}

export function handleInformOthersAboutNewParticipant({
  newParticipant,
}: {
  newParticipant: Participant;
}) {
  console.log("Event: informOthersAboutNewParticipant");

  const addNewParticipant = useMeeting.getState().addNewParticipant;
  const setNewlyJoinedParticipant =
    useMeeting.getState().setNewlyJoinedParticipant;

  const participant: Participant = {
    ...newParticipant,
    hasJoinedMeeting: true,
    localSettings: {
      micOn: true,
      cameraOn: true,
    },
  };

  addNewParticipant(participant);
  setNewlyJoinedParticipant(participant);

  createPeerConnection(newParticipant.id);
}

export function handleInformNewParticipantAboutOthers({
  otherParticipants,
  newParticipant,
}: {
  otherParticipants: Participant[];
  newParticipant: Participant;
}) {
  console.log("Event: informNewParticipantAboutOthers");

  const setOtherParticipants = useMeeting.getState().setOtherParticipants;
  const setCurrentParticipant = useMeeting.getState().setCurrentParticipant;

  setCurrentParticipant({
    ...newParticipant,
    localSettings: {
      micOn: newParticipant.micOn,
      cameraOn: newParticipant.cameraOn,
    },
    hasJoinedMeeting: true,
  });

  const participants = otherParticipants.map((participant) => ({
    ...participant,
    hasJoinedMeeting: true,
    localSettings: {
      micOn: true,
      cameraOn: true,
    },
  }));
  setOtherParticipants(participants);

  // Create Peer Connections for other participants
  otherParticipants.forEach((participant) => {
    createPeerConnection(participant.id);
  });
}

export async function handelDenyJoiningMeeting({
  newParticipant,
}: {
  newParticipant: Participant;
}) {
  console.log("Event: denyJoiningMeeting");
  const { id: userId, meetingId } = newParticipant;

  await deleteMeetingHistory(userId, meetingId);

  const ws = getWSConnection();
  ws.close();
  redirect("/dashboard");
}

export function handleInformOthersAboutLeftParticipant({
  leftParticipant,
}: {
  leftParticipant: Participant;
}) {
  console.log("Event: informOthersAboutLeftParticipant");

  const removeLeftParticipant = useMeeting.getState().removeLeftParticipant;
  const setLeftParticipant = useMeeting.getState().setLeftParticipant;

  removeLeftParticipant(leftParticipant.id); // from the otherParticipants array
  setLeftParticipant(leftParticipant);
}

export function handleReceiveMessage({
  _id,
  senderId,
  sendTo,
  meetingId,
  chatMessage,
  files,
}: ChatPayload) {
  const setChat = useChat.getState().setChat;
  setChat({ _id, senderId, sendTo, meetingId, chatMessage, files });
}

export function handleHandRaise(payload: HandRaisePayload) {
  console.log("Event: HandRaise");

  const { handRaise, handRaiserId } = payload;

  const setOtherParticipantHandRaise =
    useMeeting.getState().setOtherParticipantHandRaise;
  setOtherParticipantHandRaise(handRaise, handRaiserId);
}

export function handleMediaOn(payload: MediaOnPayload) {
  console.log("Event: mediaOn");

  const setOtherParticipantRemoteMediaOn =
    useMeeting.getState().setOtherParticipantRemoteMediaOn;

  setOtherParticipantRemoteMediaOn(payload);
}

export function handleEmojiReaction(payload: EmojiReactionPayload) {
  console.log("Event: Emoji Reaction");
  const { setReaction, removeReaction } = useMeetingMedia.getState();

  const id = `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const left = 30 + Math.random() * 40;

  setReaction(id, payload.reaction, left);

  const timer = setTimeout(() => {
    removeReaction(id);
    reactionTimers.delete(id);
  }, 2700);

  reactionTimers.set(id, timer);
}

export async function handleEndMeeting(payload: null) {
  console.log("Event: handleEndMeeting");
  const resetMeeting = useMeeting.getState().resetMeeting;
  const resetMeetingMedia = useMeetingMedia.getState().resetMeetingMedia;
  const resetChat = useChat.getState().resetChat;
  const currentParticipant = useMeeting.getState().currentParticipant;
  const setIsEnded = useMeeting.getState().setIsEnded;
  if (!currentParticipant) return;

  setIsEnded(true);

  await saveEndMeetingHistory(
    currentParticipant.id,
    currentParticipant.isHost,
    currentParticipant.meetingId,
  );

  resetMeeting();
  resetMeetingMedia();
  resetChat();
  redirect("/dashboard");
}
