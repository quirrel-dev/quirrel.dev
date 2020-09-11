import * as TokensAPI from "./tokens-api"
import db from "db"

export function describeToken(projectSlug: string, tokenId: string) {
  return `${projectSlug}.${tokenId}`
}

export async function add(projectSlug: string, name: string, userId: string) {
  const { id } = await db.token.create({
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

  const token = await TokensAPI.create(describeToken(projectSlug, id))

  return token
}

export async function remove(projectSlug: string, name: string, userId: string) {
  await TokensAPI.revoke(describeToken(projectSlug, name))

  await db.token.deleteMany({ where: { projectSlug, name } })
  return true
}
