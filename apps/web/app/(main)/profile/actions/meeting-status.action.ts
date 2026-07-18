"use server";

import { meetingsCollection } from "@repo/db";

export const getMeetingsStatus = async (userId: string) => {
  console.log("Getting meetings Status");

  try {
    const meetings = await meetingsCollection();
    const meetingsList = await meetings.find({ userId }).toArray();

    const meetingsInfo = {
      hostedMeetings: 0,
      joinedMeetings: 0,
      totalSpentTimeInSec: 0,
    };

    meetingsList.forEach((meeting) => {
      const timeSpentInSec = (meeting.endTime - meeting.startTime) / 1000;
      meetingsInfo.totalSpentTimeInSec += timeSpentInSec;

      if (meeting.isHost) {
        meetingsInfo.hostedMeetings += 1;
      } else {
        meetingsInfo.joinedMeetings += 1;
      }
    });

    return {
      success: true,
      message: "Meetings info fetched successfully",
      meetingsInfo,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching meetings info",
      meetingsInfo: {
        hostedMeetings: 0,
        joinedMeetings: 0,
        totalSpentTimeInSec: 0,
      },
    };
  }
};
