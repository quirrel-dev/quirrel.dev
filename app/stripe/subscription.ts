import db from "db"
import * as ProjectsRepo from "../projects/projects-repo"

export async function onSubscriptionCanceled(customerId: string) {
  await Promise.all([
    db.user.updateMany({
      where: { id: customerId },
      data: { subscriptionId: null },
    }),
    ProjectsRepo.removeByOwnerId(customerId),
  ])
}
