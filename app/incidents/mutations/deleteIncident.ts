import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

export default resolver.pipe(
  resolver.zod(z.object({ id: z.string() })),
  resolver.authorize(),
  async (args, ctx) => {
    await db.incident.deleteMany({
      where: {
        id: args.id,
        tokenProjectOwnerId: ctx.session.userId,
      },
    })
  }
)
