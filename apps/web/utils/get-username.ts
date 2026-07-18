import { useMeeting } from "@/store/meeting";

export function getUsername(sendTo: string) {
  const otherParticipants = useMeeting.getState().otherParticipants;
  const currentParticipant = useMeeting.getState().currentParticipant;
  if (!currentParticipant) return;

  const allParticipants = [currentParticipant, ...otherParticipants];

  if (sendTo === "everyone") {
    return "everyone";
  } else {
    const participant = allParticipants.find((p) => p.id === sendTo);
    return participant?.username;
  }
}
