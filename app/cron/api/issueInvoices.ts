import db from "db"
import { getBeginningOfCurrentMonth } from "app/cron/utils"
import { CronJob } from "quirrel/next"

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

export default CronJob("api/issueInvoices", "skip", async () => {
  await resetOverageWarnings()

  const usage = await getUsageQuotasPerSubscribedUser()

  for (const {} of usage) {
    // call paddle / fastspring
  }
})
