"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ChangePassword from "./components/change-password";
import MeetingStatus from "./components/meeting-status";
import ProfileForm from "./components/profile-form";
import ProfileHeader from "./components/profile-header";
import DeleteAccount from "./components/delete-account";

const springIn = (delay = 0) =>
  ({
    initial: { x: 40, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 300, damping: 32, delay },
  }) as const;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className="min-h-screen bg-[#0b0c0f] px-4 py-8 text-white"
      style={{ colorScheme: "dark" }}
      data-testid="profile-page"
    >
      <div className="mx-auto w-full max-w-5xl space-y-6 pt-16">
        <motion.div {...springIn(0)} className="space-y-2">
          <p className="text-[11px] uppercase tracking-wider text-white/50">
            Account
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Profile Settings
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-white/60">
            Manage your account information, security, and preferences.
          </p>
        </motion.div>

        <motion.div {...springIn(0.04)}>
          <ProfileHeader setIsEditing={setIsEditing} />
        </motion.div>
        <motion.div {...springIn(0.08)}>
          <MeetingStatus />
        </motion.div>
        <motion.div {...springIn(0.12)}>
          <ProfileForm isEditing={isEditing} setIsEditing={setIsEditing} />
        </motion.div>
        <motion.div {...springIn(0.16)}>
          <ChangePassword />
        </motion.div>
        <motion.div {...springIn(0.2)}>
          <DeleteAccount />
        </motion.div>
      </div>
    </div>
  );
}
