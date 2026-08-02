"use client";

import { deleteUser } from "@/lib/auth-client";
import { AlertTriangle } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function DeleteAccount() {
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Delete your account? This action cannot be undone.",
    );
    if (!confirmed) return;

    const { error } = await deleteUser({ callbackURL: "/goodbye" });
    if (error) toast.error(error.message);
    else toast.success("An email has been sent to confirm the deletion");
  };

  return (
    <div
      className="rounded-2xl border border-red-500/20 bg-[#111317]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
      data-testid="delete-account-panel"
    >
      <div className="flex items-center gap-3 border-b border-red-500/15 px-6 py-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 ring-1 ring-red-500/20"
          aria-hidden
        >
          <AlertTriangle className="h-5 w-5 text-red-300" />
        </div>
        <div>
          <h3 className="text-base font-semibold leading-tight text-red-200">
            Danger zone
          </h3>
          <p className="mt-0.5 text-xs text-white/50">
            Permanently delete your account and all associated data.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-white/90">
            Delete your account
          </p>
          <p className="text-xs text-white/50">
            Once deleted, your meetings, profile, and settings cannot be
            recovered.
          </p>
        </div>

        <button
          onClick={handleDeleteAccount}
          aria-label="Delete account permanently"
          data-testid="delete-account-btn"
          className="inline-flex h-10 shrink-0 items-center rounded-full bg-red-500/90 px-5 text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
        >
          Delete account
        </button>
      </div>
    </div>
  );
}
