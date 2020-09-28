import db from "db"
import { SessionContext } from "blitz"
import { hashPassword } from "app/auth/auth-utils"
import { SignupInput, SignupInputType } from "app/auth/validations"
import { sendEmailWithTemplate } from "app/postmark"
import { url } from "app/url"
import * as verifyEmail from "../verify-email"
import subscribeToNewsletter from "app/users/mutations/subscribeToNewsletter"

export default async function signup(
  input: SignupInputType,
  ctx: { session?: SessionContext } = {}
) {
  // This throws an error if input is invalid
  const { email, password } = SignupInput.parse(input)

  const existingUser = await db.user.findOne({ where: { email } })
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
      verify_email_url: url`/verifyEmail/${emailCode}`,
    }),
    subscribeToNewsletter({ email, skipConfirm: true }),

    ctx.session!.create({ userId: user.id, roles: [] }),
  ])

  return "success"
}
