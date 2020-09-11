import db from "db"

export async function remove(slug: string, userId: string) {
  await db.project.delete({
    where: {
      slug_ownerId: {
        slug,
        ownerId: userId,
      },
    },
  })
}
