import type { SessionContext } from "blitz"
import db from "db"
import { stripe } from "../stripe"

export default async function addPaymentMethod(
  { paymentMethodId, name }: { paymentMethodId: string; name: string },
  ctx: { session?: SessionContext } = {}
) {
  ctx.session?.authorize()

  await stripe.paymentMethods.attach(paymentMethodId, { customer: ctx.session?.userId })

  await stripe.customers.update(ctx.session?.userId, {
    name,
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })

  await db.user.update({
    where: { id: ctx.session?.userId },
    data: { defaultPaymentMethodId: paymentMethodId },
  })
}
