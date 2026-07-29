import { useMeeting } from "@/store/meeting";
import { Participant } from "@repo/types";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { cn } from "@repo/ui/lib/utils";
import { motion } from "framer-motion";
import { a } from "framer-motion/client";
import { X, Search, Pin, PinOff, Mic, MicOff, Hand } from "lucide-react";
import { useState } from "react";
import ParticipantsList from "./panels/participants/participants-list";
import PermissionModal from "./panels/participants/permission-modal";

export default function ParticipantsPanel() {
  const [query, setQuery] = useState("");
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const activePanel = useMeeting((state) => state.activePanel);
  const setActivePanel = useMeeting((state) => state.setActivePanel);
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const allParticipants = [currentParticipant, ...otherParticipants].filter(
    (p) => p !== null,
  );

  const filtered = allParticipants.filter((p: Participant) =>
    p.username.toLowerCase().includes(query.toLowerCase()),
  );

  if (activePanel !== "participants") return;

  return (
    <motion.aside
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      data-testid="participants-panel"
      className="w-[320px] lg:w-[400px] z-30 shrink-0 border-l border-border bg-[#111317] flex flex-col fixed right-0 bottom-0 top-22"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h2 className="font-display font-semibold text-base">
            People{" "}
            <span className="ml-2 text-muted-foreground font-normal">
              {allParticipants.length}
            </span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Tap to spotlight anyone
          </p>
        </div>

        <Button
          data-testid="people-close-btn"
          variant="ghost"
          size="icon"
          onClick={() => setActivePanel("none")}
          className="rounded-full h-8 w-8"
          aria-label="Close participants"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-testid="people-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people"
            className="rounded-full h-10 pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 flex">
        <ParticipantsList />
        <PermissionModal />
      </ScrollArea>
    </motion.aside>
  );
}
