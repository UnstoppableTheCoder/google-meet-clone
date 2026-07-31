import { useMeeting } from "@/store/meeting";
import { useRouter } from "next/navigation";
import { useChat } from "@/store/chat";
import { useMeetingMedia } from "@/store/meeting-media";
import { removeChatsAndFiles } from "./actions";
import { getWSConnection } from "@/lib/socket-manager";
import { labels, types } from "@repo/constants";
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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EndMeetingModal({ open, onOpenChange }: Props) {
  const router = useRouter();

  // All hooks first — never conditionally
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const resetMeeting = useMeeting((state) => state.resetMeeting);
  const resetMeetingMedia = useMeetingMedia((state) => state.resetMeetingMedia);
  const resetChat = useChat((state) => state.resetChat);
  const chats = useChat((state) => state.chats);

  if (!currentParticipant) return null;

  const fileNames = chats.flatMap((chat) => chat.files.map((f) => f.fileName));

  const handleLeaveMeeting = async () => {
    const ws = getWSConnection();
    ws?.send(
      JSON.stringify({
        label: labels.NORMAL_PROCESS,
        data: {
          type: types.LEAVE_MEETING,
          payload: { leftParticipant: currentParticipant },
        },
      }),
    );

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
    ws?.send(
      JSON.stringify({
        label: labels.NORMAL_PROCESS,
        data: {
          type: types.END_MEETING,
          payload: { participant: currentParticipant },
        },
      }),
    );

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="end-meeting-modal"
        className={[
          "w-[calc(100vw-2rem)] max-w-md sm:max-w-lg p-0 overflow-hidden",
          "rounded-2xl border border-white/10",
          "bg-[#111317]/95 backdrop-blur-xl",
          "shadow-2xl shadow-black/40",
          "text-white",
        ].join(" ")}
      >
        <div className="p-6 sm:p-8">
          {/* Icon tile */}
          <div
            aria-hidden="true"
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 border border-red-400/30"
          >
            <PhoneOff className="h-6 w-6 text-red-400" />
          </div>

          <div className="space-y-2 text-center">
            <DialogTitle className="text-xl font-semibold leading-tight text-white">
              Leave meeting?
            </DialogTitle>

            <DialogDescription className="text-sm leading-relaxed text-white/70">
              <span className="text-white/90 font-medium">
                {currentParticipant.username}
              </span>
              , are you sure you want to leave this meeting?
              {currentParticipant.isHost && (
                <span className="mt-2 block text-white/60">
                  As the host, you can leave the meeting or end it for everyone.
                </span>
              )}
            </DialogDescription>
          </div>

          {/* Actions — wraps if too wide, stacks on mobile */}
          <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
            <DialogClose asChild>
              <Button
                data-testid="end-meeting-cancel"
                variant="ghost"
                aria-label="Cancel and stay in meeting"
                className="h-10 rounded-full px-4 text-sm font-medium bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/40"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              data-testid="end-meeting-leave"
              onClick={handleLeaveMeeting}
              aria-label="Leave meeting"
              className="h-10 rounded-full px-4 text-sm font-medium bg-white/10 border border-white/10 text-white hover:bg-white/[0.14] transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              Leave meeting
            </Button>

            {currentParticipant.isHost && (
              <Button
                data-testid="end-meeting-end-all"
                onClick={handleEndMeeting}
                aria-label="End meeting for everyone"
                className="h-10 rounded-full px-4 text-sm font-medium bg-red-500 text-white hover:bg-red-500/90 transition-colors focus-visible:ring-2 focus-visible:ring-red-500/40 shadow-sm shadow-red-500/20"
              >
                End for everyone
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
