import { useMeeting } from "@/store/meeting";
import { useRouter } from "next/navigation";
import React, { RefObject } from "react";
import { useChat } from "@/store/chat";
import { useMeetingMedia } from "@/store/meeting-media";
import { removeChatsAndFiles } from "./actions";
import { getWSConnection } from "@/lib/socket-manager";
import { labels, types } from "@repo/constants";
import { cn } from "@repo/ui/lib/utils";
import { saveEndMeetingHistory } from "@/actions/meeting.action";
import { PhoneOff } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";

export default function EndMeetingModal({
  endMeetingRef,
}: {
  endMeetingRef: RefObject<HTMLDialogElement | null>;
}) {
  const router = useRouter();
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  if (!currentParticipant) return;

  const resetMeeting = useMeeting((state) => state.resetMeeting);
  const resetMeetingMedia = useMeetingMedia((state) => state.resetMeetingMedia);
  const resetChat = useChat((state) => state.resetChat);

  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const chats = useChat((state) => state.chats);
  const fileNames: string[] = [];

  chats.forEach((chat) => {
    const files = chat.files;
    files.forEach((file) => fileNames.push(file.fileName));
  });

  const handleLeaveMeeting = async () => {
    const ws = getWSConnection();
    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.LEAVE_MEETING,
        payload: {
          leftParticipant: currentParticipant,
        },
      },
    };
    ws.send(JSON.stringify(message));

    if (otherParticipants.length === 0) {
      await handleEndMeeting();
      return;
    }

    router.push("/dashboard");

    await saveEndMeetingHistory(
      currentParticipant.id,
      currentParticipant.isHost,
      currentParticipant.meetingId,
    );
    resetMeeting();
    resetMeetingMedia();
    resetChat();
  };

  const handleEndMeeting = async () => {
    const ws = getWSConnection();
    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.END_MEETING,
        payload: {
          participant: currentParticipant,
        },
      },
    };
    ws.send(JSON.stringify(message));
    router.push("/dashboard");
    await removeChatsAndFiles(currentParticipant.meetingId, fileNames);

    await saveEndMeetingHistory(
      currentParticipant.id,
      currentParticipant.isHost,
      currentParticipant.meetingId,
    );
    resetMeeting();
    resetMeetingMedia();
    resetChat();
  };

  return (
    <Dialog>
      <DialogContent
        ref={endMeetingRef}
        className="max-w-md rounded-3xl border border-border p-0 shadow-2xl"
      >
        <div className="p-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <PhoneOff className="h-8 w-8 text-destructive" />
          </div>

          <div className="space-y-2 text-center">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Leave Meeting?
            </DialogTitle>

            <DialogDescription className="text-sm leading-6 text-muted-foreground">
              {currentParticipant?.username}, are you sure you want to leave
              this meeting?
              {currentParticipant?.isHost &&
                " As the host, you can either leave the meeting or end it for everyone."}
            </DialogDescription>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-11 rounded-xl px-6 font-medium"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              variant="secondary"
              onClick={handleLeaveMeeting}
              className="h-11 rounded-xl px-6"
            >
              Leave Meeting
            </Button>

            {currentParticipant?.isHost && (
              <Button
                variant="destructive"
                onClick={handleEndMeeting}
                className="h-11 rounded-xl px-6"
              >
                End for Everyone
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
