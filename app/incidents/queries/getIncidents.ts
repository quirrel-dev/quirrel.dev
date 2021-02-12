import { resolver, paginate } from "blitz"
import db from "db"
import * as z from "zod"

export default resolver.pipe(
  resolver.zod(
    z.object({
      environmentName: z.string(),
      projectSlug: z.string(),
      skip: z.number(),
      take: z.number(),
    })
  ),
  resolver.authorize(),
  async ({ environmentName, projectSlug, skip, take }, ctx) => {
    const where = {
      tokenProjectOwnerId: ctx.session.userId,
      tokenName: environmentName,
      tokenProjectSlug: projectSlug,
    }

    return await paginate({
      skip,
      take,
      count: () =>
        db.incident.count({
          where,
        }),
      query: async (paginateArgs) => {
        const incidents = await db.incident.findMany({
          ...paginateArgs,
          where,
          select: {
            id: true,
            incident: true,
            jobData: true,
          },
          orderBy: {
            date: "desc",
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
      },
    })
  }
)
