import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return;

  const fileName = `${Date.now()}-${file.name}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: "uploads/" + fileName,
    ContentType: file.type,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  return Response.json({ uploadUrl, fileName, fileType: file.type });
}
