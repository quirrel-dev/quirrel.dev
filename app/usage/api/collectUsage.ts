import { parseToken } from "app/projects/tokens-repo"
import * as TokensAPI from "app/projects/tokens-api"
import db from "db"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import basicAuth from "basic-auth"
import { sendEmailWithTemplate } from "app/postmark"
import { url } from "app/url"

function getBeginningOfCurrentMonth(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

function isAuthenticated(req: BlitzApiRequest) {
  const result = basicAuth(req)
  if (!result) {
    return false
  }

  return result.pass === process.env.COLLECT_USAGE_PASSPHRASE
}

export default async function collectUsage(req: BlitzApiRequest, res: BlitzApiResponse) {
  if (!isAuthenticated(req)) {
    return res.status(401).end()
  }

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

  const trialUsageThisMonth = await db.$queryRaw(
    `SELECT "tokenProjectOwnerId", SUM("invocations") FROM "UsageRecord"
    WHERE "timestamp" >= '${getBeginningOfCurrentMonth().toISOString()}'
    AND "tokenProjectOwnerId" IN (
      SELECT "id" FROM "User"
      WHERE "subscriptionId" IS NULL
      AND "isActive" = true
    )
    GROUP BY "tokenProjectOwnerId"
    HAVING SUM("invocations") >= 100;`
  )

  for (const { tokenProjectOwnerId: userId, sum } of trialUsageThisMonth) {
    const user = await db.user.findOne({ where: { id: userId } })
    await sendEmailWithTemplate(user!.email, "plan-exceeded", {
      invocations: sum,
      action_url: url`/dashboard`,
    })
  }

  return res.status(200).end()
}
