import db from "db"
import { resolver } from "blitz"

export default resolver.pipe(async (_, ctx) => {
  if (!ctx.session.userId) return null

  const user = await db.user.findUnique({
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
})
