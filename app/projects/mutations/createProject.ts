import { resolver } from "blitz"
import * as ProjectsRepo from "../projects-repo"
import * as z from "zod"

export default resolver.pipe(
  resolver.zod(z.string()),
  resolver.authorize(),
  async (slug, { session: { userId } }) => {
    await ProjectsRepo.create(slug, userId)
  }
)
