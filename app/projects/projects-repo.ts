import db from "db"
import * as TokensRepo from "./tokens-repo"

export async function deactivate(slug: string, userId: string) {
  await TokensRepo.removeAllFromProject(userId, slug)

  await db.project.update({
    where: { ownerId_slug: { ownerId: userId, slug } },
    data: { isActive: false },
  })
}

export async function deactivateByOwnerId(ownerId: string) {
  await TokensRepo.removeAllFromUser(ownerId)

  await db.project.updateMany({ where: { ownerId }, data: { isActive: false } })
}

export async function create(slug: string, userId: string) {
  await db.project.upsert({
    where: {
      ownerId_slug: {
        ownerId: userId,
        slug,
      },
    },
    update: {
      isActive: true,
    },
    create: {
      slug,
      owner: {
        connect: {
          id: userId,
        },
      },
    },
  })
}
