import db from "db"
import { SessionContext } from "blitz"
import { hashPassword } from "app/auth/auth-utils"
import { SignupInput, SignupInputType } from "app/auth/validations"
import { stripe } from "app/stripe/stripe"

export default async function signup(
  input: SignupInputType,
  ctx: { session?: SessionContext } = {}
) {
  // This throws an error if input is invalid
  const { email, password } = SignupInput.parse(input)

  const emailExists = await db.user.count({ where: { email } })
  if (emailExists) {
    return "email_exists"
  }

  const customer = await stripe.customers.create({
    email,
  })

  console.log({ customer })

  const hashedPassword = await hashPassword(password)
  await db.user.create({
    data: { email, hashedPassword, id: customer.id },
    select: { email: true },
  })

  await ctx.session!.create({ userId: customer.id, roles: [] })

  return "success"
}
