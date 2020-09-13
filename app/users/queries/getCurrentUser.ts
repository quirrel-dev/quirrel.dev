import db from "db"
import { SessionContext } from "blitz"

export default async function getCurrentUser(_ = null, ctx: { session?: SessionContext } = {}) {
  if (!ctx.session?.userId) return null

  const user = await db.user.findOne({
    where: { id: ctx.session.userId },
    select: {
      email: true,
      subscriptionId: true,
      defaultPaymentMethodId: true,
    },
  })

  return {
    id: ctx.session.userId,
    email: user!.email,
    isSubscriber: !!user!.subscriptionId,
    hasDefaultPaymentMethod: !!user!.defaultPaymentMethodId,
  }
}
