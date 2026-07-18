"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import JoinMeeting from "./components/join-meeting";
import RecentMeetings from "./components/recent-meetings";
import { Button } from "@repo/ui/components/button";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 pt-24">
        {/* Hero */}
        <section className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="space-y-3">
            <span className="inline-flex w-fit items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              👋 Welcome back
            </span>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Dashboard
            </h1>

            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Start a new meeting, join with a meeting code, or quickly continue
              from your recent conversations.
            </p>
          </div>

          <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto">
            <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Meetings</p>
              <p className="mt-2 text-3xl font-bold">24</p>
            </div>

            <div className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Hours</p>
              <p className="mt-2 text-3xl font-bold">18h</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-3xl border border-border bg-card shadow-xl">
          <div className="border-b border-border px-8 py-6">
            <h2 className="text-xl font-semibold tracking-tight">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Create a meeting or join one using a meeting code.
            </p>
          </div>

          <div className="p-8">
            <JoinMeeting />
          </div>
        </section>

        {/* Recent Meetings */}
        <section className="mt-8 rounded-3xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-8 py-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Recent Meetings
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Access your latest meetings in one click.
              </p>
            </div>

            <Button variant="ghost" className="rounded-xl">
              View All
            </Button>
          </div>

          <div className="p-8">
            <RecentMeetings />
          </div>
        </section>
      </div>
    </div>
  );
}
