import { useEffect, useState } from "react";
import {
  Shield,
  Info,
  Sun,
  Moon,
  UserPlus,
  UserMinus,
  LayoutGrid,
  Rows3,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { useMeeting } from "@/store/meeting";
import { ActivePanel } from "@/types/meeting.types";
import useMeetingContext from "../context/use-meeting-context";
import { getMeetingInfo } from "./video/actions";

const MEETING_CODE = "meet-xrq-8x2p-akv";
const MEETING_TITLE = "Product Sync — Q1 Roadmap";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(iv);
  }, []);
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MeetingHeader({
  theme,
  onToggleTheme,
  onAddParticipant,
  onRemoveParticipant,
  showFilmstrip,
  onToggleFilmstrip,
}: any) {
  const setActivePanel = useMeeting((state) => state.setActivePanel);
  const activePanel = useMeeting((state) => state.activePanel);
  const context = useMeetingContext();
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const [startTime, setStartTime] = useState();
  const [timer, setTimer] = useState("");

  function getDuration(startTime: Date, endTime: Date) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    const duration = (end - start) / 1000;
    const h = Math.floor(duration / 3600);
    const m = Math.floor((duration % 3600) / 60);
    const s = Math.floor(duration % 60);

    const time = h
      ? `${h}h ${m}m ${s}s`
      : m
        ? `${m}m ${s}s`
        : s
          ? `${s}s`
          : "Reload the page to see";

    return time;
  }

  useEffect(() => {
    if (!currentParticipant) return;
    const { meetingId, id: userId } = currentParticipant;

    if (!startTime) {
      (async () => {
        const meetingInfo = await getMeetingInfo(meetingId, userId);
        setStartTime(meetingInfo.meeting.startTime);
      })();
      return;
    }

    const interval = setInterval(() => {
      const endTime = new Date();
      const time = getDuration(startTime, endTime);
      setTimer(time);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, currentParticipant]);

  if (!context) return;
  const { topBarChatBtnRef, topBarParticipantBtnRef } = context;

  const handleChangePanel = (activePanel: ActivePanel) => {
    setActivePanel(activePanel);
  };

  const currentTime = useClock();

  return (
    <TooltipProvider delayDuration={200}>
      <header
        data-testid="meeting-header"
        className="relative z-20 flex items-center justify-between gap-4 px-4 md:px-6 pt-4 pb-2"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-display font-bold">
            M
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1
                className="font-display text-base md:text-lg font-semibold truncate max-w-[220px] md:max-w-[400px]"
                data-testid="meeting-title"
              >
                {currentParticipant?.meetingTitle}
              </h1>
              <Badge
                variant="secondary"
                className="hidden md:inline-flex text-xs font-mono tracking-tight"
              >
                {currentParticipant?.meetingId}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span
                className="font-mono tabular-nums"
                data-testid="meeting-clock"
              >
                {currentTime}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" />
                End-to-end encrypted
              </span>
              <span className="hidden md:inline">·</span>
              <span
                className="hidden md:inline"
                data-testid="participant-count-header"
              >
                {otherParticipants.length + 1} in call
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="toggle-filmstrip-btn"
                variant="ghost"
                size="icon"
                onClick={onToggleFilmstrip}
                className="rounded-full h-10 w-10"
                aria-label="Toggle filmstrip"
              >
                {showFilmstrip ? (
                  <LayoutGrid className="w-4 h-4" />
                ) : (
                  <Rows3 className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {showFilmstrip ? "Hide filmstrip" : "Show filmstrip"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="theme-toggle-btn"
                variant="ghost"
                size="icon"
                onClick={onToggleTheme}
                className="rounded-full h-10 w-10"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="meeting-info-btn"
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10"
                aria-label="Meeting info"
              >
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Meeting details</TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
