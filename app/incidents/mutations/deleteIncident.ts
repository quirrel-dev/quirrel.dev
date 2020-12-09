import { Ctx } from "blitz"
import db from "db"

interface DeleteIncidentArgs {
  id: string
}

export default async function deleteIncident(args: DeleteIncidentArgs, ctx: Ctx) {
  ctx.session.authorize()

  await db.incident.deleteMany({
    where: {
      id: args.id,
      tokenProjectOwnerId: ctx.session.userId,
    },
  })
}
