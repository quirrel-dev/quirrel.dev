import { getBeginningOfCurrentMonth } from "app/cron/utils"
import { Ctx } from "blitz"
import db from "db"

export default async function getUsageQuota(_ = undefined, ctx: Ctx) {
  ctx.session.$authorize()

  const user = await db.user.findUnique({
    where: { id: ctx.session.userId },
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
      tokenProjectOwnerId: ctx.session.userId,
      timestamp: {
        gte: getBeginningOfCurrentMonth().toISOString(),
      },
    },
  })

  return {
    quota: freeInvocations,
    used: result.sum.invocations,
  }
}
