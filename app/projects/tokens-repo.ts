import * as TokensAPI from "./tokens-api"
import db from "db"

export function describeToken(projectId: string, name: string) {
  return [projectId, name].join(".")
}

export function parseToken(token: string) {
  const [projectId, name] = token.split(".")
  return {
    projectId,
    name,
  }
}

export async function add(projectSlug: string, name: string, userId: string) {
  const [project] = await db.project.findMany({
    where: { slug: projectSlug, ownerId: userId },
    select: { id: true },
  })

  await db.token.create({
    data: {
      name,
      project: {
        connect: {
          id: project.id,
        },
      },
    },
  })

  const token = await TokensAPI.create(describeToken(project.id, name))

  return token
}

export async function remove(projectSlug: string, name: string, ownerId: string) {
  const [project] = await db.project.findMany({
    where: { slug: projectSlug, ownerId },
    select: { id: true },
  })

  await TokensAPI.revoke(describeToken(project.id, name))

  await db.token.delete({ where: { projectId_name: { projectId: project.id, name } } })
}

export async function removeAllFromProject(projectId: string) {
  const tokens = await db.token.findMany({
    where: { projectId },
    select: { name: true },
  })

  await Promise.all(tokens.map((token) => TokensAPI.revoke(describeToken(projectId, token.name))))

  await db.token.deleteMany({ where: { projectId } })
}

export async function removeAllFromUser(ownerId: string) {
  const tokens = await db.token.findMany({
    where: { project: { ownerId } },
    select: { name: true, projectId: true },
  })

  await Promise.all(
    tokens.map((token) => TokensAPI.revoke(describeToken(token.projectId, token.name)))
  )

  await db.token.deleteMany({ where: { project: { ownerId } } })
}
