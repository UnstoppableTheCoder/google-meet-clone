"use server";

import { meetingsCollection } from "@repo/db";

export const getRecentMeetings = async (userId: string) => {
  try {
    const meetings = await meetingsCollection();
    const meetingsHistory = await meetings
      .aggregate([
        {
          $match: {
            userId,
          },
        },
        {
          $sort: {
            endTime: -1,
          },
        },
      ])
      .toArray();

    console.log("History: ", meetingsHistory);
    return {
      success: true,
      message: "Meetings History fetched successfully",
      meetingsHistory: JSON.parse(JSON.stringify(meetingsHistory)),
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching the Meetings History",
      meetingsHistory: [],
    };
  }
};
