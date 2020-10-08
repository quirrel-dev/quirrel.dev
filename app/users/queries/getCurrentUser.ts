import db from "db"
import { Ctx } from "blitz"

export default async function getCurrentUser(_ = null, ctx: Ctx) {
  if (!ctx.session.userId) return null

  const user = await db.user.findOne({
    where: { id: ctx.session.userId },
    select: {
      email: true,
      emailIsVerified: true,
      subscriptionId: true,
      subscriptionCancelURL: true,
      subscriptionPaused: true,
      subscriptionUpdateURL: true,
    },
  })

  return {
    id: ctx.session.userId,
    emailIsVerified: user!.emailIsVerified,
    email: user!.email,
    isSubscriber: !!user!.subscriptionId,
    isPaused: user!.subscriptionPaused,
    cancelURL: user!.subscriptionCancelURL,
    updateURL: user!.subscriptionUpdateURL,
  }
}
