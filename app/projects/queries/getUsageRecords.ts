import { resolver } from "blitz"
import db from "db"
import z from "zod"

export interface TimeSeriesRow {
  timestamp: Date
  invocations: number
}

export default resolver.pipe(
  resolver.zod(z.object({ projectSlug: z.string().optional(), tokenName: z.string().optional() })),
  resolver.authorize(),
  async ({ tokenName, projectSlug }, { session: { userId } }): Promise<TimeSeriesRow[]> => {
    const records = await db.usageRecord.findMany({
      where: {
        tokenName,
        tokenProjectSlug: projectSlug,
        tokenProjectOwnerId: userId,
      },
      select: {
        invocations: true,
        timestamp: true,
      },
    })

    return records
  }
)
