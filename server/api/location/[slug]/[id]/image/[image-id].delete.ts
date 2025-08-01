import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

import { deleteLocationLogImage } from "~/lib/db/queries/location-log-image";
import { s3Client } from "~/lib/s3-client";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

const config = useRuntimeConfig();

export default defineAuthenticatedEventHandler(async (event) => {
  const imageId = getRouterParam(event, "image-id") as string;

  if (!z.coerce.number().safeParse(imageId).success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Invalid image id.",
    });
  }

  const slug = getRouterParam(event, "slug") as string;
  const id = getRouterParam(event, "id") as string;

  await event.$fetch(`/api/location/${slug}/${id}`);

  const deleted = await deleteLocationLogImage(Number(imageId), event.context.user.id);

  if (deleted) {
    const command = new DeleteObjectCommand({
      Bucket: config.public.s3Bucket,
      Key: deleted.key,
    });

    await s3Client.send(command);
  }

  setResponseStatus(event, 204);
});
