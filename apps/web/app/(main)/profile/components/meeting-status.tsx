"use client";

import React, { useEffect, useState } from "react";
import { Video, Users, Timer } from "lucide-react";
import { getMeetingsStatus } from "../actions/meeting-status.action";
import { useSession } from "@/lib/auth-client";

interface MeetingsInfo {
  hostedMeetings: number;
  joinedMeetings: number;
  totalSpentTimeInSec: number;
}

export default function MeetingStatus() {
  const [meetingsInfo, setMeetingsInfo] = useState<MeetingsInfo>({
    hostedMeetings: 0,
    joinedMeetings: 0,
    totalSpentTimeInSec: 0,
  });

  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await getMeetingsStatus(user.id);
      setMeetingsInfo(res.meetingsInfo);
    })();
  }, [user]);

  function getDuration(timeInSeconds: number) {
    const h = Math.floor(timeInSeconds / 3600);
    const m = Math.floor((timeInSeconds % 3600) / 60);
    const s = Math.floor(timeInSeconds % 60);
    if (h) return `${h}h ${m}m`;
    if (m) return `${m}m ${s}s`;
    if (s) return `${s}s`;
    return "0s";
  }

  const stats = [
    {
      label: "Meetings Hosted",
      value: String(meetingsInfo.hostedMeetings ?? 0),
      Icon: Video,
      testId: "stat-hosted",
    },
    {
      label: "Meetings Joined",
      value: String(meetingsInfo.joinedMeetings ?? 0),
      Icon: Users,
      testId: "stat-joined",
    },
    {
      label: "Meeting Time",
      value: getDuration(meetingsInfo.totalSpentTimeInSec ?? 0),
      Icon: Timer,
      testId: "stat-time",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3" data-testid="meeting-status">
      {stats.map(({ label, value, Icon, testId }) => (
        <div
          key={label}
          data-testid={testId}
          className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#111317]/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl transition-colors hover:bg-white/[0.06]"
        >
          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/50">
              {label}
            </p>
            <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-white">
              {value}
            </p>
          </div>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-white/10"
            aria-hidden
          >
            <Icon className="h-5 w-5 text-blue-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
