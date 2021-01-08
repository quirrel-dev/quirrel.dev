import db from "db"
import { Ctx } from "blitz"

export default async function getProjectSlugs(params: any, ctx: Ctx) {
  ctx.session.authorize()

  const result = await db.project.findMany({
    where: { ownerId: ctx.session.userId!, isActive: true },
    select: { slug: true },
  })

  return result.map((r) => r.slug)
}
