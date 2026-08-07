import { useMeeting } from "@/store/meeting";
import { Participant } from "@repo/types";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { motion } from "framer-motion";
import { X, Search } from "lucide-react";
import { useState } from "react";
import ParticipantsList from "./participants-list";
import PermissionModal from "./permission-modal";

export default function ParticipantsPanel() {
  const [query, setQuery] = useState("");
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const activePanel = useMeeting((state) => state.activePanel);
  const setActivePanel = useMeeting((state) => state.setActivePanel);
  const otherParticipants = useMeeting((state) => state.otherParticipants);

  const allParticipants = [currentParticipant, ...otherParticipants].filter(
    (p): p is Participant => p !== null,
  );

  const filtered = allParticipants.filter((p) =>
    p.username.toLowerCase().includes(query.toLowerCase()),
  );

  if (activePanel !== "participants") return null;

  return (
    <motion.aside
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      data-testid="participants-panel"
      aria-label="Participants panel"
      className={[
        "fixed right-0 bottom-0 top-22 z-30 flex shrink-0 flex-col",
        "w-full xs:w-[400px] sm:w-[430px] max-w-[100vw]",
        "border-l border-white/5 bg-[#111317]/95 backdrop-blur-xl",
        "shadow-2xl shadow-black/40 text-white",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="min-w-0">
          <h2 className="font-semibold text-base leading-tight flex items-center gap-2">
            People
            <span
              data-testid="people-count"
              className="text-xs font-mono tabular-nums text-white/60 rounded-full bg-white/5 border border-white/5 px-2 py-0.5"
            >
              {allParticipants.length}
            </span>
          </h2>
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/50">
            Tap to spotlight anyone
          </p>
        </div>

        <Button
          data-testid="people-close-btn"
          variant="ghost"
          size="icon"
          onClick={() => setActivePanel("none")}
          aria-label="Close participants panel"
          className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-white/5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            data-testid="people-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people"
            aria-label="Search people"
            className="h-10 rounded-full pl-9 pr-4 bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-blue-500/40"
          />
        </div>
      </div>

      {/* Scrollable list — min-h-0 lets flex child actually scroll */}
      <ScrollArea className="flex-1 min-h-0">
        <ParticipantsList participants={filtered} />
      </ScrollArea>

      {/* Permission modal outside the scroll area so it stays anchored */}
      <PermissionModal />
    </motion.aside>
  );
}
