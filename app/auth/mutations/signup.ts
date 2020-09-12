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

  const customer = await stripe.customers.create({
    email,
  })

  const hashedPassword = await hashPassword(password)
  const user = await db.user.create({
    data: { email, hashedPassword, stripeCustomerId: customer.id },
    select: { id: true, email: true, stripeCustomerId: true },
  })

  await ctx.session!.create({ userId: user.id, roles: [] })

  return user
}
