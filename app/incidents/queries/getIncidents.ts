import { Ctx } from "blitz"
import db from "db"

interface GetIncidentsArgs {
  projectSlug: string
  environmentName: string
}

export default async function getIncidents(
  { environmentName, projectSlug }: GetIncidentsArgs,
  ctx: Ctx
) {
  ctx.session.authorize()

  const incidents = await db.incident.findMany({
    where: {
      tokenProjectOwnerId: ctx.session.userId,
      tokenName: environmentName,
      tokenProjectSlug: projectSlug,
    },
  })

  return incidents
}
