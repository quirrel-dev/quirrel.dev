import type { SessionContext } from "blitz"
import db from "db"
import { stripe } from "../stripe"

export default async function addPaymentMethod(
  { paymentMethodId }: { paymentMethodId: string },
  ctx: { session?: SessionContext } = {}
) {
  ctx.session?.authorize()

  const user = await db.user.findOne({
    where: { id: ctx.session?.userId },
    select: { stripeCustomerId: true },
  })

  await stripe.paymentMethods.attach(paymentMethodId, { customer: user!.stripeCustomerId })

  await stripe.customers.update(user!.stripeCustomerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })

  await db.user.update({
    where: { id: ctx.session?.userId },
    data: { stripeDefaultPaymentMethodId: paymentMethodId },
  })
}
