import { useMeeting } from "@/store/meeting";
import { useRouter } from "next/navigation";
import React, { RefObject } from "react";

export default function EndMeetingModal({
  endMeetingRef,
}: {
  endMeetingRef: RefObject<HTMLDialogElement | null>;
}) {
  const router = useRouter();
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const resetOtherParticipants = useMeeting(
    (state) => state.resetOtherParticipants,
  );

  const handleEndMeeting = () => {
    resetOtherParticipants();
    router.push("/dashboard");
  };

  return (
    <dialog ref={endMeetingRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{currentParticipant?.username}</h3>
        <p className="py-4">Do you really want to leave the meeting? 😭</p>
        <div className="modal-action gap-5">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-primary">Cancel</button>
          </form>
          <button className="btn btn-secondary" onClick={handleEndMeeting}>
            Leave
          </button>
        </div>
      </div>
    </dialog>
  );
}
