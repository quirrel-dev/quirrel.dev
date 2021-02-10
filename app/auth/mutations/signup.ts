import db from "db"
import { resolver } from "blitz"
import { hashPassword } from "app/auth/auth-utils"
import { SignupInput } from "app/auth/validations"
import { sendEmailWithTemplate } from "app/postmark"
import { url } from "app/url"
import * as verifyEmail from "../verify-email"

export default resolver.pipe(
  resolver.zod(SignupInput),
  async ({ email, password, subscribeToNewsletter }, ctx) => {
    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser?.isActive) {
      return "email_exists"
    }

    const hashedPassword = await hashPassword(password)

    const user = await db.user.create({
      data: {
        email,
        hashedPassword,
      },
      select: {
        id: true,
      },
    })

    const emailCode = await verifyEmail.generateCode(hashedPassword)

    await Promise.all([
      sendEmailWithTemplate(email, "welcome", {
        name: email,
        verify_email_url: url`/verifyEmail/${emailCode}?subscribeToNewsletter=${subscribeToNewsletter}`,
      }),
      ctx.session.$create({ userId: user.id }),
    ])

    return "success"
  }
)
