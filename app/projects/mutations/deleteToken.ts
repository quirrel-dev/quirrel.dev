import { SessionContext } from "blitz"
import * as TokensRepo from "../tokens-repo"

export default async function deleteToken(
  { projectSlug, name }: { projectSlug: string; name: string },
  ctx: { session?: SessionContext } = {}
) {
  ctx.session?.authorize()

  return await TokensRepo.remove(projectSlug, name, ctx.session?.userId)
}
