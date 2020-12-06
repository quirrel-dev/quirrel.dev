import { Ctx } from "blitz"
import db from "db"

interface AreThereIncidentsForEnvironmentArgs {
  projectSlug: string
  environmentName: string
}

export default async function areThereIncidentsForEnvironment(
  { environmentName, projectSlug }: AreThereIncidentsForEnvironmentArgs,
  ctx: Ctx
) {
  ctx.session.authorize()

  const count = await db.incident.count({
    where: {
      tokenProjectOwnerId: ctx.session.userId,
      tokenProjectSlug: projectSlug,
      tokenName: environmentName,
    },
  })

  return count !== 0
}
