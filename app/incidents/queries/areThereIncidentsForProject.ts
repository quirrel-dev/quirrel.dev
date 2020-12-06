import { Ctx } from "blitz"
import db from "db"

export default async function areThereIncidentsForProject(projectSlug: string, ctx: Ctx) {
  ctx.session.authorize()

  const count = await db.incident.count({
    where: {
      tokenProjectOwnerId: ctx.session.userId,
      tokenProjectSlug: projectSlug,
    },
  })

  return count !== 0
}
