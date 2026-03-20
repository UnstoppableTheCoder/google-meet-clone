import { types } from "@repo/constants";
import { handleSDP_Process } from "@/helpers/webrtc-process.helper";
import {
  handelDenyJoiningMeeting,
  handleConnectHost,
  handleInformNewParticipantAboutOthers,
  handleInformOthersAboutLeftParticipant,
  handleInformOthersAboutNewParticipant,
  handleNotRequestingToJoinMeeting,
  handleReceiveMessage,
  handleRequestToJoinMeeting,
} from "@/helpers/normal-process.helper";

export function handleNormalProcess(data: any) {
  switch (data.type) {
    case types.CONNECT_HOST:
      handleConnectHost(data.payload);
      break;

    case types.REQUEST_TO_JOIN_MEETING:
      handleRequestToJoinMeeting(data.payload);
      break;

    case types.NOT_REQUESTING_TO_JOIN_MEETING:
      handleNotRequestingToJoinMeeting(data.payload);
      break;

    case types.INFORM_OTHERS_ABOUT_NEW_PARTICIPANT:
      handleInformOthersAboutNewParticipant(data.payload);
      break;

    case types.INFORM_NEW_PARTICIPANT_ABOUT_OTHERS:
      handleInformNewParticipantAboutOthers(data.payload);
      break;

    case types.DENY_JOINING_MEETING:
      handelDenyJoiningMeeting(data.payload);
      break;

    case types.INFORM_OTHERS_ABOUT_LEFT_PARTICIPANT:
      handleInformOthersAboutLeftParticipant(data.payload);
      break;

    case types.RECEIVE_MESSAGE:
      handleReceiveMessage(data.payload);
      break;

    default:
      break;
  }
}

export function handleWebRTCProcess(data: any) {
  switch (data.type) {
    case types.SDP_PROCESS:
      handleSDP_Process(data.payload, data.from);
      break;

    default:
      break;
  }
}
