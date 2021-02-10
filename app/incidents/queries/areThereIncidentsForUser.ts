import { Ctx } from "blitz"
import db from "db"

export default async function areThereIncidentsForUser(_ = undefined, ctx: Ctx) {
  ctx.session.$authorize()

  const count = await db.incident.count({
    where: {
      tokenProjectOwnerId: ctx.session.userId,
    },
  })

  return count !== 0
}
