import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

export default resolver.pipe(
  resolver.zod(z.string()),
  resolver.authorize(),
  async (projectSlug, ctx) => {
    const count = await db.incident.count({
      where: {
        tokenProjectOwnerId: ctx.session.userId,
        tokenProjectSlug: projectSlug,
      },
    })

    return count !== 0
  }
)
