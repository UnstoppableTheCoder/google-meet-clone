import { getWSConnection } from "@/lib/socket-manager";
import { useMeeting } from "@/store/meeting";
import { labels, types } from "@repo/constants";
import { Button } from "@repo/ui/components/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, UserPlus } from "lucide-react";

export default function PermissionModal() {
  const joiningParticipants = useMeeting((state) => state.joiningParticipants);
  const removeJoiningParticipant = useMeeting(
    (state) => state.removeJoiningParticipant,
  );
  const resetJoiningParticipants = useMeeting(
    (state) => state.resetJoiningParticipants,
  );

  const handlePermissionAll = (granted: boolean) => {
    const ws = getWSConnection();
    joiningParticipants.forEach((newParticipant) => {
      const message = {
        label: labels.NORMAL_PROCESS,
        data: {
          type: types.GRANT_JOINING_MEETING,
          payload: { granted, newParticipant },
        },
      };
      ws?.send(JSON.stringify(message));
    });
    resetJoiningParticipants();
  };

  const handlePermission = (granted: boolean, id: string) => {
    const ws = getWSConnection();
    const newParticipant = joiningParticipants.find((p) => p.id === id);
    if (!newParticipant) return;

    const message = {
      label: labels.NORMAL_PROCESS,
      data: {
        type: types.GRANT_JOINING_MEETING,
        payload: { granted, newParticipant },
      },
    };

    removeJoiningParticipant(id);
    ws?.send(JSON.stringify(message));
  };

  return (
    <AnimatePresence>
      {joiningParticipants.length > 0 && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          data-testid="permission-modal"
          role="dialog"
          aria-label="Waiting room requests"
          className={[
            "absolute left-3 right-3 bottom-3 z-10",
            "rounded-2xl border border-white/10",
            "bg-[#111317]/95 backdrop-blur-xl",
            "shadow-2xl shadow-black/40",
            "p-3",
          ].join(" ")}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                <UserPlus className="h-4 w-4 text-blue-200" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white/90 leading-tight">
                  Waiting to join
                </p>
                <p className="text-[11px] uppercase tracking-wider text-white/50">
                  {joiningParticipants.length} request
                  {joiningParticipants.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                data-testid="permission-deny-all"
                variant="ghost"
                size="sm"
                onClick={() => handlePermissionAll(false)}
                aria-label="Deny all requests"
                className="h-8 rounded-full px-3 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                Deny all
              </Button>
              <Button
                data-testid="permission-allow-all"
                size="sm"
                onClick={() => handlePermissionAll(true)}
                aria-label="Allow all requests"
                className="h-8 rounded-full px-3 text-xs bg-blue-500 hover:bg-blue-500/90 text-white transition-colors"
              >
                Allow all
              </Button>
            </div>
          </div>

          {/* List */}
          <ul
            role="list"
            className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1"
          >
            {joiningParticipants.map((participant) => (
              <li
                key={participant.id}
                data-testid={`permission-row-${participant.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 border border-white/5 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-white/90">
                    {participant.username}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-white/50">
                    Wants to join
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    data-testid={`permission-deny-${participant.id}`}
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePermission(false, participant.id)}
                    aria-label={`Deny ${participant.username}`}
                    className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    data-testid={`permission-allow-${participant.id}`}
                    size="icon"
                    onClick={() => handlePermission(true, participant.id)}
                    aria-label={`Allow ${participant.username}`}
                    className="h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-500/90 text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
