"use server";

import { chatsCollection, meetingsCollection } from "@repo/db";
import { s3 } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const removeChatsAndFiles = async (
  meetingId: string,
  fileNames: string[],
) => {
  const chats = await chatsCollection();
  await chats.deleteMany({ meetingId });

  // Delete Files
  fileNames.forEach(async (fileName) => {
    console.log("FileName: ", fileName);
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: `uploads/${fileName}`,
      }),
    );
  });

  console.log("Chats & Files deleted successfully");
};

export const getMeetingInfo = async (meetingId: string, userId: string) => {
  try {
    const meetings = await meetingsCollection();
    const meeting = await meetings.findOne({ meetingId, userId });

    return {
      success: true,
      message: "Successfully fetched meeting info",
      meeting: JSON.parse(JSON.stringify(meeting)),
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch meeting info",
      meeting: {},
    };
  }
};
