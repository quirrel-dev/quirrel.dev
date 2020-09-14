import * as TokensAPI from "./tokens-api"
import db from "db"

export function describeToken(ownerId: string, projectSlug: string, name: string) {
  return [ownerId, projectSlug, name].join(".")
}

export function parseToken(token: string) {
  const [ownerId, projectSlug, name] = token.split(".")
  return {
    ownerId,
    projectSlug,
    name,
  }
}

export async function add(projectSlug: string, name: string, userId: string) {
  await db.token.upsert({
    where: {
      projectSlug_projectOwnerId_name: {
        projectOwnerId: userId,
        name,
        projectSlug,
      },
    },
    create: {
      name,
      project: {
        connect: {
          ownerId_slug: {
            ownerId: userId,
            slug: projectSlug,
          },
        },
      },
    },
    update: {
      isActive: true,
    },
  })

  const token = await TokensAPI.create(describeToken(userId, projectSlug, name))

  return token
}

export async function remove(projectSlug: string, name: string, ownerId: string) {
  await TokensAPI.revoke(describeToken(ownerId, projectSlug, name))

  await db.token.update({
    where: {
      projectSlug_projectOwnerId_name: {
        projectOwnerId: ownerId,
        projectSlug,
        name,
      },
    },
    data: {
      isActive: false,
    },
  })
}

export async function removeAllFromProject(projectOwnerId: string, projectSlug: string) {
  const tokens = await db.token.findMany({
    where: { projectSlug, projectOwnerId, isActive: true },
    select: { name: true },
  })

  await Promise.all(
    tokens.map((token) => TokensAPI.revoke(describeToken(projectOwnerId, projectSlug, token.name)))
  )

  await db.token.updateMany({ where: { projectSlug, projectOwnerId }, data: { isActive: false } })
}

export async function removeAllFromUser(ownerId: string) {
  const tokens = await db.token.findMany({
    where: { project: { ownerId } },
    select: { name: true, projectSlug: true, isActive: true },
  })

  await Promise.all(
    tokens.map((token) => TokensAPI.revoke(describeToken(ownerId, token.projectSlug, token.name)))
  )

  await db.token.updateMany({ where: { projectOwnerId: ownerId }, data: { isActive: false } })
}
