import { useMeeting } from "@/store/meeting";
import { Card, CardContent } from "@repo/ui/components/card";
import React, { useEffect, useState } from "react";
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

    const time = h
      ? `${h}h ${m}m ${s}s`
      : m
        ? `${m}m ${s}s`
        : s
          ? `${s}s`
          : "0";

    return time;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="rounded-2xl border border-border bg-card shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl">
            🎥
          </div>

          <p className="text-3xl font-semibold tracking-tight">
            {meetingsInfo?.hostedMeetings}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">Meetings Hosted</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-card shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl">
            👥
          </div>

          <p className="text-3xl font-semibold tracking-tight">
            {meetingsInfo?.joinedMeetings}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">Meetings Joined</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-card shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl">
            ⏱️
          </div>

          <p className="text-3xl font-semibold tracking-tight">
            {getDuration(meetingsInfo.totalSpentTimeInSec)}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">Meeting Time</p>
        </CardContent>
      </Card>
    </div>
  );
}
