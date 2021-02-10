import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

export default resolver.pipe(
  resolver.zod(z.object({ environmentName: z.string(), projectSlug: z.string() })),
  resolver.authorize(),
  async ({ projectSlug, environmentName }, { session: { userId } }) => {
    const count = await db.incident.count({
      where: {
        tokenProjectOwnerId: userId,
        tokenProjectSlug: projectSlug,
        tokenName: environmentName,
      },
    })

    return count !== 0
  }
)
