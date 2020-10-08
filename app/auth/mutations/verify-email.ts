import { Ctx } from "blitz"
import db from "db"
import { verifyCode } from "../verify-email"
import * as mailchimp from "app/mailchimp"

export default async function verifyEmail(
  { code, subscribeToNewsletter }: { code: string; subscribeToNewsletter: boolean },
  ctx: Ctx
) {
  ctx.session.authorize()
  const user = await db.user.findOne({
    where: { id: ctx.session.userId },
    select: { hashedPassword: true, email: true },
  })
  const { hashedPassword } = user!
  const isValid = await verifyCode(code, hashedPassword)
  if (isValid) {
    await db.user.update({ where: { id: ctx.session.userId }, data: { emailIsVerified: true } })

    if (subscribeToNewsletter) {
      await mailchimp.subscribeToNewsletter(user!.email, true)
    }

    return true
  } else {
    return false
  }
}
