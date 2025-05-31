import { and, eq, like, or } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";

import type { InsertLocation } from "../schema";

import db from "..";
import { location } from "../schema";

export async function findLocations(userId: number) {
  return await db.query.location.findMany({
    where: eq(location.userId, userId),
  });
}

export async function findByLocationName(existing: InsertLocation, userId: number) {
  return await db.query.location.findFirst({
    where: and(eq(location.name, existing.name), eq(location.userId, userId)),
  });
}

export async function findLocationsBySlug(slug: string) {
  return await db.query.location.findMany({
    columns: {
      slug: true,
    },
    where: or(eq(location.slug, slug), like(location.slug, `${slug}-%`)),
  });
}

export function findUniqueAvailableSlug(existingSlugs: { slug: string }[], slug: string) {
  const slugsSet = new Set(existingSlugs.map(location => location.slug));
  const MAX_ATTEMPTS = 50;
  let currentAttempt = 0;
  let uniqueSlugAvailable = false;

  while (slugsSet.size > 0 && !uniqueSlugAvailable && currentAttempt < MAX_ATTEMPTS) {
    currentAttempt++;
    const id = customAlphabet(alphanumeric, 8)();
    const idSlug = `${slug}-${id}`;

    if (!slugsSet.has(idSlug)) {
      slug = idSlug;
      uniqueSlugAvailable = true;
    }
  }
  return slug;
}

export async function insertLocation(insertable: InsertLocation, slug: string, userId: number) {
  const [created] = await db
    .insert(location)
    .values({
      ...insertable,
      slug,
      userId,
    })
    .returning();

  return created;
}
