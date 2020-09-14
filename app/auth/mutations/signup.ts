import db from "db"
import { SessionContext } from "blitz"
import { hashPassword } from "app/auth/auth-utils"
import { SignupInput, SignupInputType } from "app/auth/validations"
import { stripe } from "app/stripe/stripe"
import { sendEmailWithTemplate } from "app/postmark"
import { url } from "app/url"
import * as verifyEmail from "../verify-email"

async function findCustomerOrCreate(email: string) {
  const existingOnes = await stripe.customers.list({ email })
  if (existingOnes.data.length > 0) {
    return existingOnes.data[0]
  }

  const customer = await stripe.customers.create({
    email,
  })

  return customer
}

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
  const customer = await findCustomerOrCreate(email)

  await db.user.upsert({
    where: {
      email,
    },
    create: {
      id: customer.id,
      email,
      hashedPassword,
      subscriptionId: customer.subscriptions?.data[0].id,
      defaultPaymentMethodId: customer.default_source as string | null,
    },
    update: {
      id: customer.id,
      hashedPassword,
      isActive: true,
      subscriptionId: customer.subscriptions?.data[0].id,
      defaultPaymentMethodId: customer.default_source as string | null,
    },
  })

  const emailCode = await verifyEmail.generateCode(hashedPassword)

  await sendEmailWithTemplate(email, "welcome", {
    name: email,
    verify_email_url: url`/verifyEmail/${emailCode}`,
  })

  await ctx.session!.create({ userId: customer.id, roles: [] })

  return "success"
}
