import type { SessionContext } from "blitz"
import db from "db"
import { stripe } from "../stripe"

export default async function getCustomerPortalLink(
  { returnUrl: return_url }: { returnUrl: string },
  ctx: { session?: SessionContext } = {}
) {
  ctx.session?.authorize()

  const user = await db.user.findOne({
    where: { id: ctx.session?.userId },
    select: { stripeCustomerId: true },
  })

  const session = await stripe.billingPortal.sessions.create({
    customer: user!.stripeCustomerId,
    return_url,
  })

  return session.url
}
