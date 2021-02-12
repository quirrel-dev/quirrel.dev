import { resolver } from "blitz"
import { authenticateUser } from "app/auth/auth-utils"
import { LoginInput } from "../validations"

export default resolver.pipe(resolver.zod(LoginInput), async ({ email, password }, ctx) => {
  const user = await authenticateUser(email, password)

  await ctx.session.$create({ userId: user.id, roles: [] })

  return user
})
