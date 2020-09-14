import db from "db"
import { SessionContext } from "blitz"

export default async function getProjectSlugs(params: any, ctx: { session?: SessionContext } = {}) {
  if (!ctx.session?.isAuthorized()) {
    return []
  }

  const result = await db.project.findMany({
    where: { ownerId: ctx.session?.userId, isActive: true },
    select: { slug: true },
  })

  return result.map((r) => r.slug)
}
