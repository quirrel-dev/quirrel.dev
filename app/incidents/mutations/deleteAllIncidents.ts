import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

export default resolver.pipe(
  resolver.zod(z.object({ tokenName: z.string(), projectSlug: z.string() })),
  resolver.authorize(),
  async (args, ctx) => {
    await db.incident.deleteMany({
      where: {
        tokenName: args.tokenName,
        tokenProjectSlug: args.projectSlug,
        tokenProjectOwnerId: ctx.session.userId,
      },
    })
  }
)
