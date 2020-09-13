import { SessionContext } from "blitz"
import db from "db"

export default async function createProject(slug: string, ctx: { session?: SessionContext } = {}) {
  ctx.session?.authorize()

  await db.project.create({
    data: {
      slug,
      owner: {
        connect: {
          id: ctx.session?.userId,
        },
      },
    },
  })
}
