import { stripe } from "./stripe"
import db from "db"
import * as ProjectsRepo from "app/projects/projects-repo"

export async function invokeCustomerDeletion(customerId: string) {
  await stripe.customers.del(customerId)
}

export async function onCustomerDeleted(customerId: string) {
  await ProjectsRepo.removeByOwnerId(customerId)
  await db.user.update({
    where: { id: customerId },
    data: {
      isActive: false,
      subscriptionId: null,
      emailIsVerified: false,
    },
  })
}
