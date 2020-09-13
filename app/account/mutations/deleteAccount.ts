import { invokeCustomerDeletion } from "app/stripe/customer"
import { SessionContext } from "blitz"

export default async function deleteAccount(obj?: any, ctx: { session?: SessionContext } = {}) {
  ctx.session?.authorize()

  await invokeCustomerDeletion(ctx.session?.userId)

  await ctx.session!.revoke()
}
