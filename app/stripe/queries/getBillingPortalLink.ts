import type { SessionContext } from "blitz"
import { stripe } from "../stripe"

export default async function getCustomerPortalLink(
  { returnUrl: return_url }: { returnUrl: string },
  ctx: { session?: SessionContext } = {}
) {
  ctx.session?.authorize()

  const session = await stripe.billingPortal.sessions.create({
    customer: ctx.session?.userId,
    return_url,
  })

  return session.url
}
