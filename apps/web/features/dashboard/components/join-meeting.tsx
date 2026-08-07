"use client";

import React, { useState } from "react";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight, Link2, Keyboard } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

/**
 * Extracts a meeting ID from either:
 *  - a raw ID: "ed2828cd49"
 *  - a full URL: "https://meetflow.app/meeting/ed2828cd49?foo=bar"
 *  - a path: "/meeting/ed2828cd49"
 * Returns null if nothing usable is found.
 */
function extractMeetingId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    const match = url.pathname.match(/\/meeting\/([^/?#]+)/i);
    if (match?.[1]) return match[1];
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length) return segments[segments.length - 1]!;
  } catch {
    const pathMatch = value.match(/\/meeting\/([^/?#]+)/i);
    if (pathMatch?.[1]) return pathMatch[1];
  }

  const cleaned = value.replace(/^\/+/, "").split(/[/?#]/)[0];
  return cleaned || null;
}

export default function JoinMeeting() {
  const [joinInput, setJoinInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isUrl = /^https?:\/\//i.test(joinInput.trim());
  const canJoin = joinInput.trim().length > 0;

  const handleCreateMeeting = () => {
    const meetingId = crypto.randomBytes(5).toString("hex");
    router.push(`/meeting/${meetingId}`);
  };

  const handleJoinMeeting = () => {
    const id = extractMeetingId(joinInput);
    if (!id) {
      setError("Enter a valid meeting code or link");
      return;
    }
    setError(null);
    router.push(`/meeting/${id}`);
  };

  return (
    <div className="w-full" data-testid="join-meeting-row">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Primary CTA */}
        <Button
          onClick={handleCreateMeeting}
          aria-label="Start a new meeting"
          data-testid="new-meeting-btn"
          className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-blue-500 px-5 text-sm font-medium text-white shadow-none transition-colors hover:bg-blue-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New meeting
        </Button>

        {/* Divider on desktop */}
        <span
          className="hidden text-[11px] uppercase tracking-wider text-white/40 md:inline"
          aria-hidden="true"
        >
          or
        </span>

        {/* Join row (sunken tray) */}
        <div
          className={`flex flex-1 items-center gap-2 rounded-full border bg-black/20 p-1 pl-4 transition-colors ${
            error
              ? "border-red-500/40"
              : "border-white/10 focus-within:border-white/20"
          }`}
        >
          {isUrl ? (
            <Link2
              className="h-4 w-4 shrink-0 text-blue-400"
              aria-hidden="true"
            />
          ) : (
            <Keyboard
              className="h-4 w-4 shrink-0 text-white/50"
              aria-hidden="true"
            />
          )}

          <Input
            placeholder="Enter meeting code or link"
            value={joinInput}
            onChange={(e) => {
              setJoinInput(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleJoinMeeting()}
            aria-label="Meeting code or link"
            data-testid="meeting-code-input"
            className="h-9 flex-1 border-0 bg-transparent px-0 font-mono text-sm tracking-wide text-white placeholder:font-sans placeholder:text-white/40 focus-visible:ring-0"
          />

          <Button
            onClick={handleJoinMeeting}
            disabled={!canJoin}
            aria-label="Join meeting"
            data-testid="join-meeting-btn"
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-blue-500/15 px-4 text-xs font-medium uppercase tracking-wider text-blue-200 transition-colors hover:bg-blue-500/25 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            Join
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Helper / error text */}
      <p
        className="mt-2 px-1 text-[11px] uppercase tracking-wider text-white/40"
        data-testid="join-meeting-hint"
      >
        {error ? (
          <span className="normal-case tracking-normal text-red-400">
            {error}
          </span>
        ) : isUrl ? (
          "Link detected · we'll extract the code"
        ) : (
          "Paste a link or type the code"
        )}
      </p>
    </div>
  );
}
