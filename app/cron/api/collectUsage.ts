import { parseToken } from "app/projects/tokens-repo"
import * as TokensAPI from "app/projects/tokens-api"
import db from "db"
import { sendEmailWithTemplate } from "app/postmark"
import { url } from "app/url"
import { getBeginningOfCurrentMonth } from "app/cron/utils"
import { CronJob } from "quirrel/next"
import { sendHeartbeat } from "app/cron/heartbeat"

async function writeUsageIntoDB() {
  const usage = await TokensAPI.getUsage()
  const timestamp = Date.now()
  const timestampAsISO = new Date(timestamp).toISOString()

  if (Object.entries(usage).length > 0) {
    await db.$executeRaw(`
      INSERT INTO "UsageRecord" ("tokenProjectOwnerId", "tokenProjectSlug", "tokenName", "timestamp", "invocations")
      VALUES
        ${Object.entries(usage)
          .map(([token, invocations]) => {
            const { ownerId, projectSlug, name } = parseToken(token)
            return `('${ownerId}', '${projectSlug}', '${name}', '${timestampAsISO}', ${invocations})`
          })
          .join(", \n")}
    `)
  }
}

async function notifyFreeUsersOfOverage() {
  const trialUsageThisMonth = await db.$queryRaw(
    `SELECT "User"."id", "User"."email", SUM("invocations") FROM "UsageRecord"
    JOIN "User" ON "User"."id" = "tokenProjectOwnerId"
    WHERE (
        "User"."subscriptionId" IS NULL
      OR
        "User"."subscriptionPaused"
    )
    AND "User"."isActive" = true
    AND "User"."hasBeenWarnedAboutOverage" = false

    AND "timestamp" >= '${getBeginningOfCurrentMonth().toISOString()}'

    GROUP BY "User"."id"
    HAVING SUM("invocations") > "User"."freeInvocations";`
  )

  await Promise.all(
    trialUsageThisMonth.map(async ({ id, email, sum }) => {
      await Promise.all([
        sendEmailWithTemplate(email, "plan-exceeded", {
          invocations: sum,
          action_url: url`/dashboard`,
        }),
        db.user.update({ where: { id }, data: { hasBeenWarnedAboutOverage: true } }),
      ])
    })
  )
}

export default CronJob("collectUsage", "@hourly", async () => {
  await writeUsageIntoDB()
  await notifyFreeUsersOfOverage()

  await sendHeartbeat(() => process.env.COLLECT_USAGE_HEARTBEAT_URL)
})
