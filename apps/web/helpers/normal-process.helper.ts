import { File, Participant } from "@repo/types";
import { useMeeting } from "../store/meeting";
import { getWSConnection } from "@/lib/socket-manager";
import { redirect } from "next/navigation";
import { createPeerConnection } from "@/lib/peer-manager";
import { useChat } from "@/store/chat";

export function handleConnectHost({ host }: { host: Participant }) {
  console.log("Event: connectHost");

  const setHost = useMeeting.getState().setHost;
  setHost(host);
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

  const participant = { ...newParticipant, micOn: true, cameraOn: true };

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
  const setNewlyJoinedParticipant =
    useMeeting.getState().setNewlyJoinedParticipant;

  const newlyJoinedParticipant = {
    ...newParticipant,
    micOn: true,
    cameraOn: true,
  };
  const participants = otherParticipants.map((participant) => ({
    ...participant,
    micOn: true,
    cameraOn: true,
  }));

  setNewlyJoinedParticipant(newlyJoinedParticipant);
  setOtherParticipants(participants);

  // Create Peer Connections for other participants
  otherParticipants.forEach((participant) => {
    createPeerConnection(participant.id);
  });
}

export function handelDenyJoiningMeeting({
  newParticipant,
}: {
  newParticipant: Participant;
}) {
  console.log("Event: denyJoiningMeeting");

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
  senderId,
  meetingId,
  chatMessage,
  files,
}: {
  senderId: string;
  meetingId: string;
  chatMessage: string;
  files: File[];
}) {
  const setChat = useChat.getState().setChat;
  setChat({ senderId, chatMessage, files });
}
