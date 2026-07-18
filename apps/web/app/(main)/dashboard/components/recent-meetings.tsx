import React, { useEffect, useState } from "react";
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

export default function RecentMeetings() {
  const [recentMeetings, setRecentMeetings] = useState<RecentMeeting[]>([]);

  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (user) {
      console.log("Fetching the meeting history");
      getRecentMeetings(user.id)
        .then((res) => {
          setRecentMeetings(res.meetingsHistory);
        })
        .catch((e) => console.error(e.message));
    }
  }, [user]);

  function getDuration(startTime: Date, endTime: Date) {
    if (endTime === null) return "Reload the page to see";

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

  return (
    <div className="space-y-5">
      <div className="space-y-4 overflow-y-auto pr-1">
        {recentMeetings.map((meeting, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold">
                  {meeting.meetingTitle}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {getDuration(meeting.startTime, meeting.endTime)}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                🎥
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
