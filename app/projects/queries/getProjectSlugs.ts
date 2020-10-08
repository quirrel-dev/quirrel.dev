import db from "db"
import { Ctx } from "blitz"

export default async function getProjectSlugs(params: any, ctx: Ctx) {
  if (!ctx.session.isAuthorized()) {
    return []
  }

  const result = await db.project.findMany({
    where: { ownerId: ctx.session.userId!, isActive: true },
    select: { slug: true },
  })

  return result.map((r) => r.slug)
}
