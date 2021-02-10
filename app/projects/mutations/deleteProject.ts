import { resolver } from "blitz"
import * as ProjectsRepo from "../projects-repo"
import * as z from "zod"

export default resolver.pipe(
  resolver.zod(z.object({ slug: z.string() })),
  resolver.authorize(),
  async ({ slug }: { slug: string }, { session: { userId } }) => {
    await ProjectsRepo.deactivate(slug, userId)
  }
)
