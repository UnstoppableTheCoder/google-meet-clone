"use client";

import { motion } from "framer-motion";
import { Hand, Video, Clock } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import JoinMeeting from "./components/join-meeting";
import RecentMeetings from "./components/recent-meetings";
import { useState } from "react";

const springIn = {
  initial: { x: 40, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: "spring", stiffness: 300, damping: 32 },
} as const;

export default function DashboardPage() {
  const [showAllMeetings, setShowAllMeetings] = useState(false);

  return (
    <div
      className="min-h-screen bg-[#0b0c0f] text-white"
      style={{ colorScheme: "dark" }}
      data-testid="dashboard-page"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 pt-24">
        {/* Hero */}
        <motion.section
          {...springIn}
          className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div className="space-y-3">
            <span
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/60"
              data-testid="welcome-pill"
            >
              <Hand className="h-3.5 w-3.5 text-blue-300" aria-hidden />
              Welcome back
            </span>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Dashboard
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-white/60">
              Start a new meeting, join with a meeting code, or quickly continue
              from your recent conversations.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto">
            <StatCard
              testId="stat-meetings"
              label="Meetings"
              value="24"
              Icon={Video}
            />
            <StatCard
              testId="stat-hours"
              label="Hours"
              value="18h"
              Icon={Clock}
            />
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          {...springIn}
          transition={{ ...springIn.transition, delay: 0.05 }}
          className="rounded-2xl border border-white/5 bg-[#111317]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
          data-testid="quick-actions-panel"
        >
          <div className="border-b border-white/5 px-4 py-3 sm:px-6">
            <h2 className="text-base font-semibold leading-tight">
              Quick Actions
            </h2>
            <p className="mt-1 text-xs text-white/50">
              Create a meeting or join one using a meeting code.
            </p>
          </div>

          <div className="p-4 sm:p-6">
            <JoinMeeting />
          </div>
        </motion.section>

        {/* Recent Meetings */}
        <motion.section
          {...springIn}
          transition={{ ...springIn.transition, delay: 0.1 }}
          className="mt-6 rounded-2xl border border-white/5 bg-[#111317]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
          data-testid="recent-meetings-panel"
        >
          <div className="flex items-center justify-between border-b border-white/5 px-4 pt-3  sm:px-6">
            <div>
              <h2 className="text-base font-semibold leading-tight">
                Recent Meetings
              </h2>
              <p className="mt-1 text-xs text-white/50">
                Access your latest meetings in one click.
              </p>
            </div>

            <Button
              variant="ghost"
              aria-label={
                showAllMeetings
                  ? "Show fewer meetings"
                  : "View all recent meetings"
              }
              aria-expanded={showAllMeetings}
              data-testid="view-all-recent-btn"
              onClick={() => setShowAllMeetings((v) => !v)}
              className="rounded-full bg-white/5 px-4 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {showAllMeetings ? "Show less" : "View All"}
            </Button>
          </div>

          <div className="p-4 sm:p-6">
            <RecentMeetings showAll={showAllMeetings} />
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  Icon,
  testId,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
  testId: string;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.04] px-5 py-4 transition-colors hover:bg-white/10"
      data-testid={testId}
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
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10"
        aria-hidden
      >
        <Icon className="h-5 w-5 text-blue-300" />
      </div>
    </div>
  );
}
