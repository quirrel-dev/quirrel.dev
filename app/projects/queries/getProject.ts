import db from "db"
import { resolver } from "blitz"
import z from "zod"

export default resolver.pipe(
  resolver.zod(z.object({ slug: z.string() })),
  resolver.authorize(),
  async ({ slug }, { session: { userId } }) => {
    const project = await db.project.findUnique({
      where: {
        ownerId_slug: {
          ownerId: userId,
          slug,
        },
      },
      include: {
        tokens: {
          select: {
            name: true,
          },
          where: {
            isActive: true,
          },
        },
      },
    })
    if (!project?.isActive) {
      return null
    }

    return project
  }
)
