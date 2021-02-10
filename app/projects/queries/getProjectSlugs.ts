import db from "db"
import { resolver } from "blitz"

export default resolver.pipe(resolver.authorize(), async (_, { session: { userId } }) => {
  const result = await db.project.findMany({
    where: { ownerId: userId, isActive: true },
    select: { slug: true },
  })

  return result.map((r) => r.slug)
})
