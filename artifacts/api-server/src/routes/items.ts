import { and, count, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  CreateFoundItemBody,
  CreateFoundItemResponse,
  GetFoundItemStatsResponse,
  ListFoundItemsQueryParams,
  ListFoundItemsResponse,
} from "@workspace/api-zod";
import { db, foundItemsTable } from "@workspace/db";

const router: IRouter = Router();
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isCalendarDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

router.get("/items", async (req, res): Promise<void> => {
  const parsed = ListFoundItemsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid search filters." });
    return;
  }

  const { q, dateFrom, dateTo, limit, offset } = parsed.data;
  if (
    (dateFrom && !isCalendarDate(dateFrom)) ||
    (dateTo && !isCalendarDate(dateTo)) ||
    (dateFrom && dateTo && dateFrom > dateTo)
  ) {
    res.status(400).json({ error: "Enter a valid found-date range." });
    return;
  }

  const filters = [];
  if (q?.trim()) {
    const pattern = `%${escapeLikePattern(q.trim())}%`;
    filters.push(
      or(
        ilike(foundItemsTable.name, pattern),
        ilike(foundItemsTable.category, pattern),
        ilike(foundItemsTable.location, pattern),
        ilike(foundItemsTable.publicDescription, pattern),
      ),
    );
  }
  if (dateFrom) filters.push(gte(foundItemsTable.foundAt, dateFrom));
  if (dateTo) filters.push(lte(foundItemsTable.foundAt, dateTo));

  const items = await db
    .select()
    .from(foundItemsTable)
    .where(and(...filters))
    .orderBy(desc(foundItemsTable.foundAt), desc(foundItemsTable.createdAt))
    .limit(limit)
    .offset(offset);

  res.json(ListFoundItemsResponse.parse(items));
});

router.post("/items", async (req, res): Promise<void> => {
  const parsed = CreateFoundItemBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn(
      {
        issues: parsed.error.issues.map(({ path, code }) => ({ path, code })),
      },
      "Rejected invalid found-item report",
    );
    res.status(400).json({ error: "Check the required fields and try again." });
    return;
  }

  const input = {
    ...parsed.data,
    name: parsed.data.name.trim(),
    category: parsed.data.category.trim(),
    publicDescription: parsed.data.publicDescription.trim(),
    location: parsed.data.location.trim(),
  };

  if (
    !input.name ||
    !input.category ||
    !input.publicDescription ||
    !input.location
  ) {
    res.status(400).json({ error: "Required fields cannot be blank." });
    return;
  }

  if (!isCalendarDate(input.foundAt)) {
    res.status(400).json({ error: "Enter a valid date found." });
    return;
  }

  const [item] = await db.insert(foundItemsTable).values(input).returning();
  if (!item) {
    res.status(500).json({ error: "The item could not be saved." });
    return;
  }

  res.status(201).json(CreateFoundItemResponse.parse(item));
});

router.get("/items/stats", async (_req, res): Promise<void> => {
  const [total, available] = await Promise.all([
    db.select({ value: count() }).from(foundItemsTable),
    db
      .select({ value: count() })
      .from(foundItemsTable)
      .where(eq(foundItemsTable.status, "available")),
  ]);

  res.json(
    GetFoundItemStatsResponse.parse({
      totalItems: total[0]?.value ?? 0,
      availableItems: available[0]?.value ?? 0,
    }),
  );
});

export default router;
