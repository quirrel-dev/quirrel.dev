import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import { isAuthenticated } from "app/cron/authenticate"
import db from "db"
import { getBeginningOfCurrentMonth } from "app/cron/utils"

async function getUsageQuotasPerSubscribedUser(): Promise<
  { subscriptionId: string; invocations: number }[]
> {
  const result = await db.$queryRaw(
    `SELECT "User"."subscriptionId", SUM("invocations") FROM "UsageRecord"
    JOIN "User" ON "User"."id" = "tokenProjectOwnerId"
    WHERE "User"."subscriptionId" IS NOT NULL
    AND "User"."subscriptionPaused" IS False
    AND "User"."isActive" = true

    AND "timestamp" >= '${getBeginningOfCurrentMonth().toISOString()}'

    GROUP BY "User"."id";`
  )

  return result.map(({ subscriptionId, sum }) => ({
    subscriptionId,
    invocations: sum,
  }))
}

async function resetOverageWarnings() {
  await db.user.updateMany({ data: { hasBeenWarnedAboutOverage: false } })
}

export default async function issueInvoices(req: BlitzApiRequest, res: BlitzApiResponse) {
  if (!isAuthenticated(req)) {
    return res.status(401).end()
  }

  await resetOverageWarnings()

  const usage = await getUsageQuotasPerSubscribedUser()

  for (const {} of usage) {
    // call paddle / fastspring
  }

  return res.status(200).end()
}
