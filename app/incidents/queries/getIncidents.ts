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
    select: {
      id: true,
      incident: true,
      jobData: true,
    },
  })

  const parsedIncidents = incidents.map((item) => {
    const { body, status } = JSON.parse(item.incident)
    const jobData = JSON.parse(item.jobData)

    return {
      id: item.id,
      incident: {
        body: body as any,
        status: status as number,
      },
      jobData: {
        id: jobData.id as string,
        payload: jobData.payload as string,
        endpoint: jobData.endpoint as string,
        runAt: new Date(jobData.runAt),
      },
    }
  })

  return parsedIncidents
}
