import { resolver } from "blitz"
import * as passwordReset from "../reset-password"
import * as z from "zod"

export default resolver.pipe(
  resolver.zod(z.object({ email: z.string(), code: z.string(), newPassword: z.string() })),
  async ({ email, code, newPassword }, ctx) => {
    const userId = await passwordReset.setPassword(email, code, newPassword)
    if (userId) {
      await ctx.session.$create({
        userId,
        roles: [],
      })

      return true
    } else {
      return false
    }
  }
)
