import db from "db"
import * as TokensRepo from "./tokens-repo"

export async function remove(slug: string, userId: string) {
  await TokensRepo.removeAllFromProject(slug, userId)
  await db.project.delete({
    where: {
      slug_ownerId: {
        slug,
        ownerId: userId,
      },
    },
  })
}

export async function removeAllOfUser(userId: string) {
  await TokensRepo.removeAllFromUser(userId)
  await db.project.deleteMany({
    where: {
      ownerId: userId,
    },
  })
}
