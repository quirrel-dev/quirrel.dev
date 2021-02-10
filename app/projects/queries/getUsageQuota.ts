import { getBeginningOfCurrentMonth } from "app/cron/utils"
import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_, { session: { userId } }) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      freeInvocations: true,
      subscriptionId: true,
      subscriptionPaused: true,
    },
  })

  let freeInvocations = user!.freeInvocations
  if (user?.subscriptionId && !user.subscriptionPaused) {
    freeInvocations = 10_000
  }

  const result = await db.usageRecord.aggregate({
    sum: {
      invocations: true,
    },
    where: {
      tokenProjectOwnerId: userId,
      timestamp: {
        gte: getBeginningOfCurrentMonth().toISOString(),
      },
    },
  })

  return {
    quota: freeInvocations,
    used: result.sum.invocations,
  }
})
