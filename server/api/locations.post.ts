import type { DrizzleError } from "drizzle-orm";

import { and, eq, like, or } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

import db from "~/lib/db";
import { InsertLocation, location } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      }),
    );
  }

  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    const statusMessage = result.error.issues
      .map(issue => `${issue.path.join("")}: ${issue.message}`)
      .join("; ");

    const data = result.error.issues.reduce(
      (errors, issue) => {
        errors[issue.path.join("")] = issue.message;
        return errors;
      },
      {} as Record<string, string>,
    );

    return sendError(
      event,
      createError({
        statusCode: 422,
        statusMessage,
        data,
      }),
    );
  }

  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 8);

  const existingLocation = await db.query.location.findFirst({
    where: and(
      eq(location.userId, event.context.user.id),
      eq(location.name, result.data.name),
    ),
  });

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
  const existingSlugs = await db.query.location.findMany({
    columns: {
      slug: true,
    },
    where: or(eq(location.slug, slug), like(location.slug, `${slug}-%`)),
  });

  const slugsSet = new Set(existingSlugs.map(location => location.slug));
  const MAX_ATTEMPTS = 50;
  let currentAttempt = 0;
  let uniqueSlugAvailable = false;

  while (
    slugsSet.size > 0
    && !uniqueSlugAvailable
    && currentAttempt < MAX_ATTEMPTS
  ) {
    currentAttempt++;
    const id = nanoid();
    const idSlug = `${slug}-${id}`;

    if (!slugsSet.has(idSlug)) {
      slug = idSlug;
      uniqueSlugAvailable = true;
    }
  }

  try {
    const [created] = await db
      .insert(location)
      .values({
        ...result.data,
        slug,
        userId: event.context.user.id,
      })
      .returning();
    return created;
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
