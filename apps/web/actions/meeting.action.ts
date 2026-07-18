"use server";

import { meetingsCollection } from "@repo/db";

export const saveEndMeetingHistory = async (
  userId: string,
  isHost: boolean,
  meetingId: string,
) => {
  console.log("Is host: ", isHost);
  try {
    const meetings = await meetingsCollection();
    await meetings.findOneAndUpdate(
      { userId, meetingId },
      {
        $set: {
          isHost,
          endTime: new Date(),
        },
      },
    );

    console.log("Successfully saved end meeting info");
  } catch (error) {
    console.log("Failed to save end meeting info");
  }
};

export const deleteMeetingHistory = async (
  userId: string,
  meetingId: string,
) => {
  try {
    const meetings = await meetingsCollection();
    await meetings.deleteOne({ userId, meetingId });

    console.log("Meeting history deleted successfully");
  } catch (error) {
    console.log("Error deleting meeting history");
  }
};
