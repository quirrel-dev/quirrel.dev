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

  const byOwnerId: Record<string, number> = {}

  for (const [token, invocations] of Object.entries(usage)) {
    const { ownerId } = parseToken(token)
    byOwnerId[ownerId] = (byOwnerId[ownerId] ?? 0) + invocations
  }

  await Promise.all(
    Object.entries(byOwnerId).map(async ([ownerId, invocations]) => {
      const subscriptions = await stripe.subscriptions.list({
        customer: ownerId,
        price: process.env.SUBSCRIPTION_PRICE_ID,
      })

      const [subscription] = subscriptions.data
      if (!subscription) {
        return
      }

      const [subscriptionItem] = subscription.items.data
      if (!subscriptionItem) {
        console.error("Subscription is missing required item")
        return
      }

      await stripe.subscriptionItems.createUsageRecord(subscriptionItem.id, {
        action: "increment",
        quantity: invocations,
        timestamp: Math.floor(timestamp / 1000),
      })
    })
  )

  return res.status(200).end()
}
