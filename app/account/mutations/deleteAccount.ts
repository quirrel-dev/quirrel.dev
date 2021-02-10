import * as account from "../"
import { Ctx } from "blitz"

export default async function deleteAccount(obj = undefined, ctx: Ctx) {
  ctx.session.$authorize()

  await account.deactivate(ctx.session.userId)

  await ctx.session!.$revoke()
}
