import db from "db"
import * as ProjectsRepo from "app/projects/projects-repo"

export async function deactivate(customerId: string) {
  await ProjectsRepo.deactivateByOwnerId(customerId)
  await db.user.update({
    where: { id: customerId },
    data: {
      isActive: false,
      subscriptionId: null,
      emailIsVerified: false,
    },
  })
}
