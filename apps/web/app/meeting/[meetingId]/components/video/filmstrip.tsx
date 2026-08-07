import { motion, AnimatePresence } from "framer-motion";
import { Pin } from "lucide-react";
import ParticipantTile from "./participant-tile";
import { cn } from "@repo/ui/lib/utils";
import { useMeeting } from "@/store/meeting";

export default function Filmstrip({
  participants,
  registerVideoRef,
  unregisterVideoRef,
}: any) {
  const pinnedId = useMeeting((state) => state.pinnedId);
  const setPinnedId = useMeeting((state) => state.setPinnedId);

  const togglePin = (id: string) => {
    setPinnedId(id === pinnedId ? null : id);
  };

  return (
    <div
      data-testid="filmstrip"
      className="relative z-10 shrink-0 px-3 md:px-5 pb-2"
    >
      <div className="glass rounded-2xl px-3 py-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
              Participants
            </span>
            <span
              className="text-[11px] font-mono text-muted-foreground"
              data-testid="filmstrip-count"
            >
              {participants.length}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Pin className="w-3 h-3" /> Tap a tile to spotlight
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <AnimatePresence initial={false}>
            {participants.map((p: any) => (
              <motion.button
                key={p.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => togglePin(p.id)}
                data-testid={`filmstrip-item-${p.id}`}
                className={cn(
                  "relative shrink-0 aspect-video w-40 md:w-44 rounded-xl overflow-hidden ring-1 ring-border/60 hover:ring-primary/60 transition-shadow",
                  pinnedId === p.id &&
                    "ring-2 ring-primary shadow-lg shadow-primary/20",
                )}
                aria-label={`Spotlight ${p.name}`}
              >
                <ParticipantTile
                  participant={p}
                  size="sm"
                  showControlsOnHover={false}
                  registerVideoRef={registerVideoRef}
                  unregisterVideoRef={unregisterVideoRef}
                />
                {pinnedId === p.id && (
                  <span className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center">
                    <Pin className="w-2.5 h-2.5" />
                  </span>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
