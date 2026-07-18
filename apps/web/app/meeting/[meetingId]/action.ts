"use server";

import { meetingsCollection } from "@repo/db";

interface MeetingPayloadType {
  userId: string;
  isHost: boolean;
  meetingId: string;
  meetingTitle: string;
  startTime: Date | null;
  endTime: Date | null;
}

export const saveMeetingHistory = async (
  meetingPayload: MeetingPayloadType,
) => {
  try {
    const { userId, meetingId } = meetingPayload;
    const meetings = await meetingsCollection();
    const meeting = await meetings.findOne({ userId, meetingId });

    if (meeting) {
      console.log("Meeting info is already saved in db");
      return;
    }

    await meetings.insertOne(meetingPayload);
    console.log("Successfully saved start meeting info");
  } catch (error) {
    console.log("Failed to save start meeting info");
  }
};
