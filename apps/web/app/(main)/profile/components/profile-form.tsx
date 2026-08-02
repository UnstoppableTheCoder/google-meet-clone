"use client";

import { updateUser, useSession } from "@/lib/auth-client";
import { profileSchema } from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type ProfileSchema = z.infer<typeof profileSchema>;

export default function ProfileForm({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSchema>({ resolver: zodResolver(profileSchema) });

  const { data: session } = useSession();
  const user = session?.user;

  const onSubmit = async (payload: ProfileSchema) => {
    const file = payload.file;
    const formData = new FormData();

    if (file && file.length > 0) {
      if (
        file[0].type !== "image/png" &&
        file[0].type !== "image/jpeg" &&
        file[0].type !== "image/svg+xml"
      ) {
        toast.error("Unsupported file type");
        return;
      }
      formData.append("file", file.item(0)!);
    }

    const response = await fetch(`/api/upload-image`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    const { error } = await updateUser({
      name: payload.name,
      image: result.url,
    });

    if (error) toast.error(error.message || "Error updating the user");
    else toast.success("Profile updated successfully");

    setIsEditing(false);
  };

  if (!isEditing) return null;

  return (
    <div
      className="rounded-2xl border border-white/5 bg-[#111317]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
      data-testid="profile-form-panel"
    >
      <div className="border-b border-white/5 px-6 py-4">
        <h3 className="text-base font-semibold leading-tight">
          Account settings
        </h3>
        <p className="mt-1 text-xs text-white/50">
          Update your profile information and profile picture.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
        <label className="block" htmlFor="name">
          <span className="mb-1.5 block text-[11px] uppercase tracking-wider text-white/50">
            Full name
          </span>
          <input
            id="name"
            defaultValue={user?.name}
            aria-label="Full name"
            data-testid="name-input"
            {...register("name")}
            className="h-10 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/40 transition-colors focus:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-blue-500/40"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-300">{errors.name.message}</p>
          )}
        </label>

        <label className="block" htmlFor="file">
          <span className="mb-1.5 block text-[11px] uppercase tracking-wider text-white/50">
            Profile picture
          </span>
          <input
            id="file"
            type="file"
            aria-label="Profile picture"
            data-testid="file-input"
            {...register("file")}
            className="block h-10 w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none file:mr-4 file:h-full file:rounded-full file:border-0 file:bg-blue-500/15 file:px-3 file:text-xs file:font-medium file:uppercase file:tracking-wider file:text-blue-200 hover:file:bg-blue-500/25 focus-visible:ring-2 focus-visible:ring-blue-500/40"
          />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            aria-label="Cancel editing profile"
            data-testid="cancel-profile-btn"
            className="inline-flex h-10 items-center rounded-full bg-white/5 px-5 text-sm text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label="Save profile changes"
            data-testid="save-profile-btn"
            className="inline-flex h-10 items-center rounded-full bg-blue-500 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
