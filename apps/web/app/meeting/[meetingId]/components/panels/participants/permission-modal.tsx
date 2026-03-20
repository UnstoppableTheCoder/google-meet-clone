import { getWSConnection } from "@/lib/socket-manager";
import { useMeeting } from "@/store/meeting";
import { labels, types } from "@repo/constants";
import { Button } from "@repo/ui/components/button";
import React from "react";

export default function PermissionModal() {
  const joiningParticipants = useMeeting((state) => state.joiningParticipants);
  const removeJoiningParticipant = useMeeting(
    (state) => state.removeJoiningParticipant,
  );
  const resetJoiningParticipants = useMeeting(
    (state) => state.resetJoiningParticipants,
  );

  if (joiningParticipants.length === 0) return;

  const handlePermissionAll = (granted: boolean) => {
    const ws = getWSConnection();

    joiningParticipants.forEach((newParticipant) => {
      const message = {
        label: labels.NORMAL_PROCESS,
        data: {
          type: types.GRANT_JOINING_MEETING,
          payload: {
            granted,
            newParticipant,
          },
        },
      };

      ws?.send(JSON.stringify(message));
    });

    resetJoiningParticipants();
  };

  const handlePermission = (granted: boolean, id: string) => {
    const ws = getWSConnection();

    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.GRANT_JOINING_MEETING,
        payload: {
          granted,
          newParticipant: joiningParticipants.find(
            (participant) => participant.id === id,
          ),
        },
      },
    };

    removeJoiningParticipant(id);
    ws.send(JSON.stringify(message));
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto p-3 space-y-2 border-t-2 border-gray-500">
      <h2 className="text-xl font-bold">
        Allow or Deny to join the meeting...
      </h2>

      {/* Allow & Deny all */}
      <div className="flex gap-5 mx-auto">
        <Button onClick={() => handlePermissionAll(true)}>Allow All</Button>
        <Button onClick={() => handlePermissionAll(false)}>Deny All</Button>
      </div>

      {/* Allow & Deny Manually */}
      <div className="space-y-3">
        {joiningParticipants.map((participant) => (
          <div
            key={participant.id}
            className="flex justify-between bg-gray-800 py-1 items-center px-3 rounded-lg"
          >
            <p>Name: {participant.username}</p>
            <div className="flex gap-5">
              <Button
                variant={"secondary"}
                onClick={() => handlePermission(true, participant.id)}
              >
                Allow
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => handlePermission(false, participant.id)}
              >
                Deny
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
