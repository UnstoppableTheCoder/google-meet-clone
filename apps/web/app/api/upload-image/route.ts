import { NextRequest, NextResponse } from "next/server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

const Bucket = process.env.AWS_BUCKET;

// endpoint to upload a file to the bucket
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) return;

  const fileName = `${Date.now()}-${file.name}`;

  const Body = await file.arrayBuffer();
  await s3.send(
    new PutObjectCommand({
      Bucket,
      Key: `uploads/${fileName}`,
      Body: Body as any,
      ContentType: file.type,
    }),
  );

  return NextResponse.json({
    url: `${process.env.UPLOADS_BASE_URL}/${fileName}`,
  });
}
