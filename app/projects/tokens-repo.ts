import * as TokensAPI from "./tokens-api"
import db from "db"

export function describeToken(projectSlug: string, tokenId: string) {
  return `${projectSlug}.${tokenId}`
}

async function isProjectOfUser(userId: string, slug: string) {
  const projectExists = await db.project.count({
    where: { slug, ownerId: userId },
  })

  return !!projectExists
}

export async function add(projectSlug: string, name: string, userId: string) {
  if (!(await isProjectOfUser(userId, projectSlug))) {
    return null
  }

  const { id } = await db.token.create({
    data: {
      name,
      project: {
        connect: {
          slug: projectSlug,
        },
      },
    },
  })

  const token = await TokensAPI.create(describeToken(projectSlug, id))

  return token
}

export async function remove(projectSlug: string, name: string, userId: string) {
  if (!isProjectOfUser(userId, projectSlug)) {
    return false
  }

  await TokensAPI.revoke(describeToken(projectSlug, name))

  await db.token.deleteMany({ where: { projectSlug, name } })
  return true
}
