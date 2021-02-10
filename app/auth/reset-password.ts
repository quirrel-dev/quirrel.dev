import { sendEmailWithTemplate } from "app/postmark"
import { url } from "app/url"
import db from "db"
import { hashPassword } from "./auth-utils"
import { generateCode, verifyCode } from "./verify-email"

export async function invoke(email: string) {
  const user = await db.user.findUnique({
    where: { email },
    select: { hashedPassword: true },
  })
  if (!user) {
    return
  }

  const { hashedPassword } = user!
  const resetCode = await generateCode(hashedPassword)

  await sendEmailWithTemplate(email, "password-reset", {
    name: email,
    action_url: url`/resetPassword/${encodeURIComponent(email)}/${resetCode}`,
  })
}

export async function isValidCode(email: string, code: string) {
  const user = await db.user.findUnique({ where: { email }, select: { hashedPassword: true } })

  if (!user) {
    return false
  }

  const { hashedPassword } = user

  const isValid = await verifyCode(code, hashedPassword)
  return isValid
}

export async function setPassword(email: string, code: string, password: string) {
  const isValid = await isValidCode(email, code)
  if (!isValid) {
    return false
  }

  const hashedPassword = await hashPassword(password)
  const result = await db.user.update({
    where: { email },
    data: { hashedPassword },
    select: { id: true },
  })
  return result.id
}
