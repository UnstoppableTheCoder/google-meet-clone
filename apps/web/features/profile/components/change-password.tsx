"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { changePasswordSchema } from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/lib/auth-client";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

type ChangePassword = z.infer<typeof changePasswordSchema>;

const fieldClass =
  "h-10 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/40 transition-colors focus:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-blue-500/40";

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePassword>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (payload: ChangePassword) => {
    const { error } = await changePassword({
      newPassword: payload.currentPassword,
      currentPassword: payload.confirmPassword,
      revokeOtherSessions: true,
    });
    if (error) toast.error(error.message || "Error changing the password");
    else toast.success("Password updated successfully");
    reset();
  };

  return (
    <div
      className="rounded-2xl border border-white/5 bg-[#111317]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
      data-testid="change-password-panel"
    >
      <div className="flex items-center gap-3 border-b border-white/5 px-6 py-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-white/10"
          aria-hidden
        >
          <KeyRound className="h-5 w-5 text-blue-200" />
        </div>
        <div>
          <h3 className="text-base font-semibold leading-tight">
            Change password
          </h3>
          <p className="mt-0.5 text-xs text-white/50">
            Update your password to keep your account secure.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
        <label className="block" htmlFor="current-password">
          <span className="mb-1.5 block text-[11px] uppercase tracking-wider text-white/50">
            Current password
          </span>
          <input
            id="current-password"
            type="password"
            placeholder="Enter your current password"
            aria-label="Current password"
            data-testid="current-password-input"
            className={fieldClass}
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p className="mt-1.5 text-xs text-red-300">
              {errors.currentPassword.message}
            </p>
          )}
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block" htmlFor="new-password">
            <span className="mb-1.5 block text-[11px] uppercase tracking-wider text-white/50">
              New password
            </span>
            <input
              id="new-password"
              type="password"
              placeholder="Enter a new password"
              aria-label="New password"
              data-testid="new-password-input"
              className={fieldClass}
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="mt-1.5 text-xs text-red-300">
                {errors.newPassword.message}
              </p>
            )}
          </label>

          <label className="block" htmlFor="confirm-password">
            <span className="mb-1.5 block text-[11px] uppercase tracking-wider text-white/50">
              Confirm password
            </span>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              aria-label="Confirm new password"
              data-testid="confirm-password-input"
              className={fieldClass}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-300">
                {errors.confirmPassword.message}
              </p>
            )}
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            aria-label="Reset password form"
            data-testid="reset-password-btn"
            className="inline-flex h-10 items-center rounded-full bg-white/5 px-5 text-sm text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label="Update password"
            data-testid="update-password-btn"
            className="inline-flex h-10 items-center rounded-full bg-blue-500 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            {isSubmitting ? "Updating…" : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}
