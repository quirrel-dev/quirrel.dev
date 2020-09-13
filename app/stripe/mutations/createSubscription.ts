import type { SessionContext } from "blitz"
import db from "db"
import { stripe } from "../stripe"

export default async function createSubscription(obj?: {}, ctx: { session?: SessionContext } = {}) {
  ctx.session?.authorize()

  const user = await db.user.findOne({
    where: { id: ctx.session?.userId },
    select: { subscriptionId: true },
  })

  if (user?.subscriptionId) {
    throw new Error("User already has a subscription")
  }

  const subscription = await stripe.subscriptions.create({
    customer: ctx.session?.userId,
    items: [{ price: process.env.NEXT_PUBLIC_SUBSCRIPTION_PRODUCT_ID }],
  })

  await db.user.update({
    where: { id: ctx.session?.userId },
    data: { subscriptionId: subscription.id },
  })
}
