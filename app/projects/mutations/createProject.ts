import { Ctx } from "blitz"
import * as ProjectsRepo from "../projects-repo"

export default async function createProject(slug: string, ctx: Ctx) {
  ctx.session.$authorize()

  await ProjectsRepo.create(slug, ctx.session.userId)
}
