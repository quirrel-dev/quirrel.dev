import { SessionContext } from "blitz"
import db from "db"

export default async function createProject(slug: string, ctx: { session?: SessionContext } = {}) {
  await db.project.create({
    data: {
      slug,
      owner: ctx.session?.userId,
    },
  })
}
