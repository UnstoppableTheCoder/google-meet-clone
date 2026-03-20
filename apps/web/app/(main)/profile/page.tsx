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
    <div className="min-h-screen bg-base-200 text-base-content flex justify-center p-6">
      <div className="w-full max-w-4xl space-y-6">
        <ProfileHeader setIsEditing={setIsEditing} />
        <MeetingStatus />
        <ProfileForm isEditing={isEditing} setIsEditing={setIsEditing} />
        <ChangePassword />
        <DeleteAccount />
      </div>
    </div>
  );
}
