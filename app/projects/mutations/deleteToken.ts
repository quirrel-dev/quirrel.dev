import { resolver } from "blitz"
import * as TokensRepo from "../tokens-repo"
import z from "zod"

export default resolver.pipe(
  resolver.zod(z.object({ projectSlug: z.string(), name: z.string() })),
  resolver.authorize(),
  async ({ projectSlug, name }, { session: { userId } }) => {
    return await TokensRepo.remove(projectSlug, name, userId)
  }
)
