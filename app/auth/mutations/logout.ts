import { resolver } from "blitz"

export default resolver.pipe(async (_, ctx) => {
  await ctx.session.$revoke()
})
