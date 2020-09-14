import { SessionContext } from "blitz"
import db from "db"
import { verifyCode } from "../verify-email"

export default async function verifyEmail(
  { code }: { code: string },
  ctx: { session?: SessionContext } = {}
) {
  ctx.session?.authorize()
  const user = await db.user.findOne({
    where: { id: ctx.session?.userId },
    select: { hashedPassword: true },
  })
  const { hashedPassword } = user!
  const isValid = await verifyCode(code, hashedPassword)
  if (isValid) {
    await db.user.update({ where: { id: ctx.session?.userId }, data: { emailIsVerified: true } })
    return true
  } else {
    return false
  }
}
