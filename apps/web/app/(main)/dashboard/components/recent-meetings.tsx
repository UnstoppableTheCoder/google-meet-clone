"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Inbox } from "lucide-react";
import { getRecentMeetings } from "../action";
import { useSession } from "@/lib/auth-client";

interface RecentMeeting {
  _id: string;
  userId: string;
  meetingId: string;
  meetingTitle: string;
  startTime: Date;
  endTime: Date;
}

const INITIAL_COUNT = 8;

interface RecentMeetingsProps {
  showAll: boolean;
}

export default function RecentMeetings({ showAll }: RecentMeetingsProps) {
  const [recentMeetings, setRecentMeetings] = useState<RecentMeeting[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user) return;
    getRecentMeetings(user.id)
      .then((res) => setRecentMeetings(res.meetingsHistory))
      .catch((e) => console.error(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  function getDuration(startTime: Date, endTime: Date) {
    if (endTime === null) return "In progress";
    const duration =
      (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;
    const h = Math.floor(duration / 3600);
    const m = Math.floor((duration % 3600) / 60);
    const s = Math.floor(duration % 60);
    if (h) return `${h}h ${m}m`;
    if (m) return `${m}m ${s}s`;
    if (s) return `${s}s`;
    return "—";
  }

  if (!loading && recentMeetings.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 py-12 text-center"
        data-testid="recent-meetings-empty"
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/5"
          aria-hidden
        >
          <Inbox className="h-5 w-5 text-white/60" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/90">No meetings yet</p>
          <p className="text-xs text-white/50">
            Your recent meetings will show up here.
          </p>
        </div>
      </div>
    );
  }

  const visibleMeetings = showAll
    ? recentMeetings
    : recentMeetings.slice(0, INITIAL_COUNT);

  return (
    <div className="relative" data-testid="recent-meetings-wrapper">
      <div className="relative" data-testid="recent-meetings-wrapper">
        <div
          className={
            showAll
              ? "pr-1 max-h-[340px] overflow-y-auto no-scrollbar overscroll-contain"
              : "pr-1"
          }
          data-testid="recent-meetings-scroll"
        >
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            data-testid="recent-meetings-list"
          >
            {visibleMeetings.map((meeting, index) => (
              <motion.div
                key={meeting._id ?? meeting.meetingId}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 32,
                  delay: Math.min(index * 0.02, 0.16),
                }}
                className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.04] p-4 transition-colors hover:bg-white/10"
                data-testid={`recent-meeting-${meeting.meetingId}`}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-white/10"
                  aria-hidden
                >
                  <Video className="h-5 w-5 text-blue-200" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className="truncate text-sm font-medium text-white/90"
                    title={meeting.meetingTitle}
                  >
                    {meeting.meetingTitle}
                  </h3>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider tabular-nums text-white/50">
                    {getDuration(meeting.startTime, meeting.endTime)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {showAll && recentMeetings.length > INITIAL_COUNT && (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#111317] to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#111317] to-transparent"
              aria-hidden
            />
          </>
        )}
      </div>
    </div>
  );
}
