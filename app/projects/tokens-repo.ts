import * as TokensAPI from "./tokens-api"
import db from "db"

export function describeToken(userId: string, projectSlug: string, name: string) {
  return `${userId}.${projectSlug}.${name}`
}

export async function add(projectSlug: string, name: string, userId: string) {
  await db.token.create({
    data: {
      name,
      project: {
        connect: {
          slug_ownerId: {
            slug: projectSlug,
            ownerId: userId,
          },
        },
      },
    },
  })

  const token = await TokensAPI.create(describeToken(userId, projectSlug, name))

  return token
}

export async function remove(projectSlug: string, name: string, userId: string) {
  await TokensAPI.revoke(describeToken(userId, projectSlug, name))

  await db.token.deleteMany({ where: { projectSlug, name, projectOwnerId: userId } })
}

export async function removeAllFromProject(projectSlug: string, userId: string) {
  const tokens = await db.token.findMany({
    where: { projectSlug, projectOwnerId: userId },
    select: { name: true },
  })

  await Promise.all(
    tokens.map((token) => TokensAPI.revoke(describeToken(userId, projectSlug, token.name)))
  )

  await db.token.deleteMany({ where: { projectSlug, projectOwnerId: userId } })
}

export async function removeAllFromUser(userId: string) {
  const tokens = await db.token.findMany({
    where: { projectOwnerId: userId },
    select: { name: true, projectSlug: true },
  })

  await Promise.all(
    tokens.map((token) => TokensAPI.revoke(describeToken(userId, token.projectSlug, token.name)))
  )

  await db.token.deleteMany({ where: { projectOwnerId: userId } })
}
