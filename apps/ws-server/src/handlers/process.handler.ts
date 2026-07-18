import { types } from "@repo/constants";
import {
  handleAskToConnect,
  handleEndMeeting,
  handleGrantJoiningPermission,
  handleHandRaise,
  handleLeaveMeeting,
  handleSendMessage,
} from "../helpers/normal_process.helper";
import { handleSDP_Process } from "../helpers/webrtc_process.helper";

export function handleNormalProcess(data: any) {
  switch (data.type) {
    case types.ASK_TO_CONNECT:
      handleAskToConnect(data.payload);
      break;

    case types.GRANT_JOINING_MEETING:
      handleGrantJoiningPermission(data.payload);
      break;

    case types.SEND_MESSAGE:
      handleSendMessage(data.payload);
      break;

    case types.HAND_RAISE:
      handleHandRaise(data.payload);
      break;

    case types.LEAVE_MEETING:
      handleLeaveMeeting(data.payload);
      break;

    case types.END_MEETING:
      handleEndMeeting(data.payload);
      break;

    default:
      break;
  }
}

export function handleWebRTCProcess(data: any, connectionId: string) {
  switch (data.type) {
    case types.SDP_PROCESS:
      handleSDP_Process(data, connectionId);
      break;

    default:
      break;
  }
}
