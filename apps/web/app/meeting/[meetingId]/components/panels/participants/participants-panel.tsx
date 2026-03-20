import React from "react";
import ParticipantsList from "./participants-list";
import PermissionModal from "./permission-modal";
import { useMeeting } from "@/store/meeting";

export default function ParticipantPanel() {
  const activePanel = useMeeting((state) => state.activePanel);
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  
  if (activePanel !== "participants") return;

  return (
    <div className="w-105 border-l border-base-300 bg-base-100 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex justify-between items-center">
        <h3 className="font-semibold text-base-content">
          Participants ({otherParticipants.length})
        </h3>
      </div>

      <ParticipantsList />
      <PermissionModal />
    </div>
  );
}
