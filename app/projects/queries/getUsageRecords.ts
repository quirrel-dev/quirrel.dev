import { SessionContext } from "blitz"
import db from "db"

interface TimeSeriesRow {
  timestamp: Date
  invocations: number
}

export default async function getUsageRecords(
  { tokenName, projectSlug }: { projectSlug?: string; tokenName?: string },
  ctx: { session?: SessionContext } = {}
): Promise<TimeSeriesRow[]> {
  ctx.session?.authorize()

  const records = await db.usageRecord.findMany({
    where: {
      tokenName,
      tokenProjectSlug: projectSlug,
    },
    select: {
      invocations: true,
      timestamp: true,
    },
  })

  return records
}
