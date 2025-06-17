import type { DrizzleError } from "drizzle-orm";

import slugify from "slug";

import {
  findByLocationName,
  findLocationsBySlug,
  findUniqueAvailableSlug,
  insertLocation,
} from "~/lib/db/queries/location";
import { InsertLocation } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const existingLocation = await findByLocationName(result.data, event.context.user.id);

  if (existingLocation) {
    return sendError(
      event,
      createError({
        statusCode: 409,
        statusMessage: "A location with this name already exists.",
      }),
    );
  }

  let slug = slugify(result.data.name);
  const existingSlugs = await findLocationsBySlug(slug);

  slug = findUniqueAvailableSlug(existingSlugs, slug);

  try {
    return insertLocation(result.data, slug, event.context.user.id);
  }
  catch (e) {
    const error = e as DrizzleError;
    if (
      error.message
      === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug"
    ) {
      return sendError(
        event,
        createError({
          statusCode: 409,
          statusMessage:
            "Slug must be unique (the location name is used to generate the slug).",
        }),
      );
    }

    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage:
          "Unknown error while creating the location. Please try again later.",
      }),
    );
  }
});
