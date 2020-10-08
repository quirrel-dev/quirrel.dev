import { Ctx } from "blitz"
import db from "db"

interface TimeSeriesRow {
  timestamp: Date
  invocations: number
}

export default async function getUsageRecords(
  { tokenName, projectSlug }: { projectSlug?: string; tokenName?: string },
  ctx: Ctx
): Promise<TimeSeriesRow[]> {
  ctx.session.authorize()

  const records = await db.usageRecord.findMany({
    where: {
      tokenName,
      tokenProjectSlug: projectSlug,
      tokenProjectOwnerId: ctx.session.userId,
    },
    select: {
      invocations: true,
      timestamp: true,
    },
  })

  return records
}
