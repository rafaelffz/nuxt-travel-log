import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import slugify from "slug";
import { z } from "zod";

import env from "~/lib/env";
import { s3Client } from "~/lib/s3-client";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

const MAX_CONTENT_LENGTH = 1024 * 1024;

const imageSchema = z.object({
  contentLength: z.number().min(1).max(MAX_CONTENT_LENGTH),
  checksum: z.string(),
  fileName: z.string(),
});

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, imageSchema.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const slug = getRouterParam(event, "slug") as string;
  const id = getRouterParam(event, "id") as string;

  await event.$fetch(`/api/location/${slug}/${id}`);

  const originalFileName = result.data.fileName;
  const lastDotIndex = originalFileName.lastIndexOf(".");

  const baseName
    = lastDotIndex === -1 ? originalFileName : originalFileName.slice(0, lastDotIndex);

  const fileName = `${slugify(baseName)}-${crypto.randomUUID()}`;
  const key = `${event.context.user.id}/${id}/${fileName}.jpg`;

  const signedUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      ChecksumSHA256: result.data.checksum,
      ContentLength: result.data.contentLength,
    }),
    { expiresIn: 600 },
  );

  return {
    signedUrl,
    key,
  };
});
