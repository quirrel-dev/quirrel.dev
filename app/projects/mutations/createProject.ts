import { SessionContext } from "blitz"
import * as ProjectsRepo from "../projects-repo"

export default async function createProject(slug: string, ctx: { session?: SessionContext } = {}) {
  ctx.session?.authorize()

  await ProjectsRepo.create(slug, ctx.session?.userId)
}
