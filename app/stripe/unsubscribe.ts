import db from "db"
import * as ProjectsRepo from "../projects/projects-repo"

export async function unsubscribe(customerId: string) {
  const user = await db.user.update({
    where: { stripeCustomerId: customerId },
    data: { stripeSubscriptionId: null },
    select: { id: true },
  })

  if (!user) {
    throw new Error(`User with customerId '${customerId}' not found`)
  }

  await ProjectsRepo.removeAllOfUser(user.id)
}
