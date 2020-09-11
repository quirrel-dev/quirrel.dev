import db from "db"
import { SessionContext } from "blitz"

export default async function getProject(
  { slug }: { slug: string },
  ctx: { session?: SessionContext } = {}
) {
  ctx.session?.authorize()

  const project = await db.project.findOne({
    where: { slug_ownerId: { slug, ownerId: ctx.session?.userId } },
    include: {
      tokens: {
        select: {
          name: true,
        },
      },
    },
  })

  if (project?.ownerId === ctx.session?.userId) {
    return project
  } else {
    return null
  }
}
