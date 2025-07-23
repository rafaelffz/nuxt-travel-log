import { and, eq } from "drizzle-orm";

import type { InsertLocationLog } from "../schema";

import db from "..";
import { locationLog } from "../schema";

export async function insertLocationLog(
  insertable: InsertLocationLog,
  locationId: number,
  userId: number,
) {
  return await db
    .insert(locationLog)
    .values({
      ...insertable,
      locationId,
      userId,
    })
    .returning();
}

export async function findLocationLog(id: number, userId: number) {
  return await db.query.locationLog.findFirst({
    where: and(eq(locationLog.id, id), eq(locationLog.userId, userId)),
  });
}
