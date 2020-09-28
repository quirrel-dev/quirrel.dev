import { SessionContext } from "blitz"
import * as ProjectsRepo from "../projects-repo"

export default async function deleteProject(
  { slug }: { slug: string },
  ctx: { session?: SessionContext } = {}
) {
  ctx.session?.authorize()

  await ProjectsRepo.deactivate(slug, ctx.session?.userId)
}
