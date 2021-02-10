import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const count = await db.incident.count({
    where: {
      tokenProjectOwnerId: ctx.session.userId,
    },
  })

  return count !== 0
})
