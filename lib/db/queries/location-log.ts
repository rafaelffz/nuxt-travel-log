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
