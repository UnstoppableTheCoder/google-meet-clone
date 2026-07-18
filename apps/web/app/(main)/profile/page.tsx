"use client";
import { useState } from "react";
import ChangePassword from "./components/change-password";
import MeetingStatus from "./components/meeting-status";
import ProfileForm from "./components/profile-form";
import ProfileHeader from "./components/profile-header";
import DeleteAccount from "./components/delete-account";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-5xl space-y-6 pt-16">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Manage your account information, security, and preferences.
          </p>
        </div>

        <ProfileHeader setIsEditing={setIsEditing} />
        <MeetingStatus />
        <ProfileForm isEditing={isEditing} setIsEditing={setIsEditing} />
        <ChangePassword />
        <DeleteAccount />
      </div>
    </div>
  );
}
