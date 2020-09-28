import * as account from "../"
import { SessionContext } from "blitz"

export default async function deleteAccount(obj?: any, ctx: { session?: SessionContext } = {}) {
  ctx.session?.authorize()

  await account.deactivate(ctx.session?.userId)

  await ctx.session!.revoke()
}
