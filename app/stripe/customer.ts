import { stripe } from "./stripe"
import db from "db"

export async function invokeCustomerDeletion(customerId: string) {
  await stripe.customers.del(customerId)
}

export async function onCustomerDeleted(customerId: string) {
  await db.user.delete({ where: { id: customerId } })
}
