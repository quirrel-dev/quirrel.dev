import { SessionContext } from "blitz"
import db from "db"

export default async function getAccountData(_ = null, ctx: { session?: SessionContext } = {}) {
  ctx.session?.authorize()

  return await db.user.findOne({ where: { id: ctx.session?.userId }, select: { email: true } })
}
