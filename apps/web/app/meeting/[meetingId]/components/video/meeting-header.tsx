import { useEffect, useMemo, useState } from "react";
import {
  Shield,
  Info,
  Sun,
  Moon,
  LayoutGrid,
  Rows3,
  Copy,
  Check,
  Link as LinkIcon,
  Hash,
  Clock,
  Lock,
  Users,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Button } from "@repo/ui/components/button";
import { useMeeting } from "@/store/meeting";
import { useMeetingMedia } from "@/store/meeting-media";
import useMeetingContext from "../../context/use-meeting-context";
import { getMeetingInfo } from "./actions";
import { cn } from "@repo/ui/lib/utils";

/* -------- Time helpers -------- */
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(iv);
  }, []);
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function useElapsed(startedAt: Date | string | number | null | undefined) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!startedAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  if (!startedAt) return null;
  return Math.max(0, now - new Date(startedAt).getTime());
}
function formatElapsed(ms: number) {
  const s = Math.floor(ms / 1000);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return hh > 0 ? `${hh}:${pad(mm)}:${pad(ss)}` : `${pad(mm)}:${pad(ss)}`;
}

/* -------- Copy helpers -------- */
function useCopy(resetMs = 1500) {
  const [copied, setCopied] = useState(false);
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), resetMs);
    } catch {}
  };
  return { copied, copy };
}
function CopyButton({
  value,
  label,
  testid,
  className,
}: {
  value: string;
  label: string;
  testid: string;
  className?: string;
}) {
  const { copied, copy } = useCopy();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          data-testid={testid}
          onClick={() => copy(value)}
          aria-label={copied ? `${label} copied` : label}
          className={cn(
            "h-7 w-7 shrink-0 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/40",
            className,
          )}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-blue-300" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : label}</TooltipContent>
    </Tooltip>
  );
}

/* -------- Header -------- */
export default function MeetingHeader({
  theme,
  onToggleTheme,
  showFilmstrip,
  onToggleFilmstrip,
}: any) {
  const context = useMeetingContext();
  const otherParticipants = useMeeting((state) => state.otherParticipants);
  const currentParticipant = useMeeting((state) => state.currentParticipant);
  const isRecording = useMeetingMedia((state) => state.isRecording);
  const recordingStartedAt = useMeetingMedia(
    (state) => state.recordingStartedAt,
  );

  const [startTime, setStartTime] = useState<Date | string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const currentTime = useClock();
  const meetingElapsedMs = useElapsed(startTime);
  const recordingElapsedMs = useElapsed(
    isRecording ? recordingStartedAt : null,
  );

  useEffect(() => {
    if (!currentParticipant || startTime) return;
    const { meetingId, id: userId } = currentParticipant;
    let cancelled = false;
    (async () => {
      const meetingInfo = await getMeetingInfo(meetingId, userId);
      if (!cancelled) setStartTime(meetingInfo.meeting.startTime);
    })();
    return () => {
      cancelled = true;
    };
  }, [currentParticipant, startTime]);

  const meetingLink = useMemo(() => {
    if (!currentParticipant?.meetingId || typeof window === "undefined")
      return "";
    return `${window.location.origin}/meet/${currentParticipant.meetingId}`;
  }, [currentParticipant?.meetingId]);

  if (!context) return null;

  const meetingId = currentParticipant?.meetingId ?? "";
  const meetingTitle = currentParticipant?.meetingTitle ?? "Meeting";
  const totalParticipants = otherParticipants.length + 1;

  return (
    <TooltipProvider delayDuration={200}>
      <header
        data-testid="meeting-header"
        className={cn(
          "relative z-20 grid items-center gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 pb-2 min-w-0",
          // 3-column grid: left grows, center hugs its content, right grows.
          // Using minmax(0, 1fr) so the side columns can shrink & truncate.
          "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
        )}
      >
        {/* ---------- LEFT: identity + meta ---------- */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 justify-self-start">
          <div className="hidden xs:flex h-9 w-9 shrink-0 rounded-xl bg-primary/15 text-primary items-center justify-center font-display font-bold">
            M
          </div>

          <div className="min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 min-w-0">
              <h1
                className="font-display text-sm sm:text-base md:text-lg font-semibold truncate min-w-0"
                data-testid="meeting-title"
                title={meetingTitle}
              >
                {meetingTitle}
              </h1>

              {/* ID pill — desktop only */}
              {meetingId && (
                <div
                  data-testid="meeting-id-pill"
                  className="hidden lg:inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/5 border border-white/10 pl-2.5 pr-1 py-0.5 text-xs font-mono tracking-tight text-white/80"
                >
                  <span className="truncate max-w-[140px]">{meetingId}</span>
                  <CopyButton
                    value={meetingId}
                    label="Copy meeting ID"
                    testid="copy-meeting-id-btn"
                  />
                </div>
              )}
            </div>

            {/* Meta row — clock + encrypted + count.
                Timers are now in the CENTER cluster. */}
            <div className="flex items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mt-0.5 flex-wrap min-w-0">
              <span
                className="hidden sm:inline font-mono tabular-nums"
                data-testid="meeting-clock"
              >
                {currentTime}
              </span>
              <span className="hidden sm:inline" aria-hidden="true">
                ·
              </span>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    <span className="hidden lg:inline">
                      End-to-end encrypted
                    </span>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="md:hidden">
                  End-to-end encrypted
                </TooltipContent>
              </Tooltip>

              <span aria-hidden="true">·</span>

              <span
                data-testid="participant-count-header"
                className="inline-flex items-center gap-1"
              >
                <Users className="w-3 h-3 md:hidden" />
                <span className="tabular-nums">{totalParticipants}</span>
                <span className="hidden md:inline">in call</span>
              </span>
            </div>
          </div>
        </div>

        {/* ---------- CENTER: timers cluster ---------- */}
        <div
          data-testid="header-timers"
          className="justify-self-center flex items-center gap-2"
        >
          {/* Meeting elapsed pill */}
          {meetingElapsedMs !== null && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  data-testid="meeting-elapsed-timer"
                  aria-label="Meeting duration"
                  className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-white/90"
                >
                  <Clock className="w-3.5 h-3.5 text-white/60" />
                  <span className="font-mono tabular-nums text-xs sm:text-sm">
                    {formatElapsed(meetingElapsedMs)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Meeting duration</TooltipContent>
            </Tooltip>
          )}

          {/* Recording pill — only when recording */}
          {isRecording && recordingElapsedMs !== null && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  data-testid="recording-elapsed-timer"
                  role="status"
                  aria-live="polite"
                  aria-label="Recording duration"
                  className="inline-flex items-center gap-2 rounded-full bg-red-500/15 border border-red-500/40 px-3 py-1.5 text-red-200"
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-red-500 animate-pulse"
                  />
                  <span className="hidden sm:inline text-[10px] uppercase tracking-wider font-medium text-red-300">
                    Rec
                  </span>
                  <span className="font-mono tabular-nums text-xs sm:text-sm">
                    {formatElapsed(recordingElapsedMs)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Recording in progress</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* ---------- RIGHT: actions ---------- */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 justify-self-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="toggle-filmstrip-btn"
                variant="ghost"
                size="icon"
                onClick={onToggleFilmstrip}
                className="hidden md:inline-flex rounded-full h-10 w-10"
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
                className="hidden sm:inline-flex rounded-full h-9 w-9 sm:h-10 sm:w-10"
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

          <Popover open={detailsOpen} onOpenChange={setDetailsOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    data-testid="meeting-info-btn"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-full h-9 w-9 sm:h-10 sm:w-10",
                      detailsOpen && "bg-blue-500/15 text-blue-200",
                    )}
                    aria-label="Meeting details"
                    aria-expanded={detailsOpen}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Meeting details</TooltipContent>
            </Tooltip>

            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={8}
              collisionPadding={12}
              className="w-[min(92vw,20rem)] p-0 rounded-2xl border border-white/10 bg-[#111317]/95 backdrop-blur-xl shadow-2xl shadow-black/40"
            >
              <div className="px-4 py-3 border-b border-white/5">
                <div className="text-[11px] uppercase tracking-wider text-white/50">
                  Meeting details
                </div>
                <h3 className="mt-1 text-sm font-semibold text-white truncate">
                  {meetingTitle}
                </h3>
              </div>

              <div className="p-3 flex flex-col gap-2">
                <div className="rounded-2xl bg-white/5 border border-white/5 p-3">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/50">
                    <LinkIcon className="w-3 h-3" />
                    Joining link
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div
                      data-testid="meeting-link-text"
                      className="flex-1 min-w-0 text-xs text-white/90 font-mono truncate"
                      title={meetingLink}
                    >
                      {meetingLink || "—"}
                    </div>
                    {meetingLink && (
                      <CopyButton
                        value={meetingLink}
                        label="Copy meeting link"
                        testid="copy-meeting-link-btn"
                      />
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/5 p-3">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/50">
                    <Hash className="w-3 h-3" />
                    Meeting ID
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div
                      data-testid="meeting-id-text"
                      className="flex-1 min-w-0 text-xs text-white/90 font-mono truncate"
                    >
                      {meetingId || "—"}
                    </div>
                    {meetingId && (
                      <CopyButton
                        value={meetingId}
                        label="Copy meeting ID"
                        testid="copy-meeting-id-details-btn"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-white/5 border border-white/5 p-3">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/50">
                      <Clock className="w-3 h-3" />
                      Duration
                    </div>
                    <div className="mt-1 text-sm font-mono tabular-nums text-white">
                      {meetingElapsedMs !== null
                        ? formatElapsed(meetingElapsedMs)
                        : "—"}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/5 p-3">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/50">
                      <Lock className="w-3 h-3" />
                      Security
                    </div>
                    <div className="mt-1 text-xs text-emerald-300 inline-flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Encrypted
                    </div>
                  </div>
                </div>

                <button
                  data-testid="copy-joining-info-btn"
                  onClick={async () => {
                    const payload = [
                      meetingTitle,
                      meetingLink && `Link: ${meetingLink}`,
                      meetingId && `ID: ${meetingId}`,
                    ]
                      .filter(Boolean)
                      .join("\n");
                    try {
                      await navigator.clipboard.writeText(payload);
                    } catch {}
                    setDetailsOpen(false);
                  }}
                  className="mt-1 w-full rounded-full h-10 bg-blue-500 hover:bg-blue-500/90 text-white text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  aria-label="Copy joining info"
                >
                  Copy joining info
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>
    </TooltipProvider>
  );
}
