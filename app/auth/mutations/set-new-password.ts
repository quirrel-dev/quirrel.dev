import { Ctx } from "blitz"
import * as passwordReset from "../reset-password"

export default async function setNewPassword(
  {
    email,
    code,
    newPassword,
  }: {
    email: string
    code: string
    newPassword: string
  },
  ctx: Ctx
) {
  const userId = await passwordReset.setPassword(email, code, newPassword)
  if (userId) {
    await ctx.session?.create({
      roles: [],
      userId,
    })

    return true
  } else {
    return false
  }
}
