"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Keyboard, ArrowRight, Link2 } from "lucide-react";

/**
 * Extracts the meeting ID from either:
 *  - a raw ID: "ed2828cd49"
 *  - a full URL: "https://meetflow.app/meeting/ed2828cd49?foo=bar"
 *  - a path: "/meeting/ed2828cd49"
 * Returns null if it can't find anything usable.
 */
function extractMeetingId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  // Try parsing as URL
  try {
    const url = new URL(value);
    const match = url.pathname.match(/\/meeting\/([^/?#]+)/i);
    if (match?.[1]) return match[1];
    // Fallback: last non-empty path segment
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length) return segments[segments.length - 1]!;
  } catch {
    // Not a URL — check if it's a path-like string
    const pathMatch = value.match(/\/meeting\/([^/?#]+)/i);
    if (pathMatch?.[1]) return pathMatch[1];
  }

  // Treat as raw ID (strip whitespace and any leading slashes)
  const cleaned = value.replace(/^\/+/, "").split(/[/?#]/)[0];
  return cleaned || null;
}

export default function JoinMeeting() {
  const [joinInput, setJoinInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // const isUrl = /^https?:\/\//i.test(joinInput.trim());
  const isUrl = /^http?:\/\//i.test(joinInput.trim());
  const canJoin = joinInput.trim().length > 0;

  const handleJoinMeeting = () => {
    const id = extractMeetingId(joinInput);
    if (!id) {
      setError("Enter a valid meeting code or link");
      return;
    }
    setError(null);
    router.push(`/meeting/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleJoinMeeting();
  };

  return (
    <div className="w-full">
      <div
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 pl-4 transition-colors focus-within:border-white/20"
        data-testid="join-meeting-container"
      >
        <div className="flex flex-1 items-center gap-2">
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

          <input
            type="text"
            value={joinInput}
            onChange={(e) => {
              setJoinInput(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter meeting code or link"
            aria-label="Meeting code or link"
            data-testid="join-meeting-input"
            className="h-9 w-full min-w-0 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
          />
        </div>

        <button
          onClick={handleJoinMeeting}
          disabled={!canJoin}
          aria-label="Join meeting"
          data-testid="join-meeting-button"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-blue-500 px-4 text-xs font-medium text-white transition-colors hover:bg-blue-500/90 focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:opacity-40"
        >
          Join
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Helper / error text */}
      <div className="mt-2 flex items-center justify-between px-1">
        <p
          className="text-[11px] uppercase tracking-wider text-white/40"
          data-testid="join-meeting-hint"
        >
          {error ? (
            <span className="text-red-400 normal-case tracking-normal">
              {error}
            </span>
          ) : isUrl ? (
            "Link detected · we'll extract the code"
          ) : (
            "Paste a link or type the code"
          )}
        </p>
      </div>
    </div>
  );
}
