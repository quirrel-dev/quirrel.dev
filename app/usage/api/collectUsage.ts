import { parseToken } from "app/projects/tokens-repo"
import { stripe } from "app/stripe/stripe"
import * as TokensAPI from "app/projects/tokens-api"
import db from "db"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import basicAuth from "basic-auth"

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

  const byProjectId: Record<string, number> = {}

  if (Object.entries(usage).length > 0) {
    await db.$executeRaw(`
      INSERT INTO "UsageRecord" ("tokenProjectId", "tokenProjectName", "timestamp", "invocations")
      VALUES
        ${Object.entries(usage)
          .map(([token, invocations]) => {
            const { projectId, name } = parseToken(token)
            return `('${projectId}', '${name}', '${timestampAsISO}', ${invocations})`
          })
          .join(", \n")}
    `)
  }

  for (const [token, invocations] of Object.entries(usage)) {
    const { projectId } = parseToken(token)
    byProjectId[projectId] = (byProjectId[projectId] ?? 0) + invocations
  }

  await Promise.all(
    Object.entries(byProjectId).map(async ([projectId, invocations]) => {
      await stripe.subscriptionItems.createUsageRecord(projectId, {
        action: "increment",
        quantity: invocations,
        timestamp: Math.floor(timestamp / 1000),
      })
    })
  )

  return res.status(200).end()
}
