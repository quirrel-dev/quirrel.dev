import db from "db"

export async function updateDefaultPaymentMethod(customerId: string, methodId: string | null) {
  await db.user.update({
    where: { stripeCustomerId: customerId },
    data: { stripeDefaultPaymentMethodId: methodId },
  })
}
