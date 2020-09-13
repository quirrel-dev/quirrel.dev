import { stripe } from "app/stripe/stripe"
import db from "db"
import * as TokensRepo from "./tokens-repo"

export async function remove(slug: string, userId: string) {
  const [project] = await db.project.findMany({
    where: { slug, ownerId: userId },
    select: { id: true },
  })

  await removeByProjectId(project.id)
}

export async function removeByProjectId(projectId: string) {
  await stripe.subscriptionItems.del(projectId)

  await TokensRepo.removeAllFromProject(projectId)

  await db.project.delete({ where: { id: projectId } })
}

export async function removeByOwnerId(ownerId: string) {
  const projects = await db.project.findMany({
    where: { ownerId },
    select: { id: true },
  })

  await Promise.all(projects.map(async (project) => await stripe.subscriptionItems.del(project.id)))

  await TokensRepo.removeAllFromUser(ownerId)

  await db.project.deleteMany({ where: { ownerId } })
}

export async function create(slug: string, userId: string) {
  const slugExists = await db.project.count({
    where: { slug, ownerId: userId },
  })

  if (slugExists) {
    return "slug_exists"
  }

  const user = await db.user.findOne({
    where: { id: userId },
    select: { subscriptionId: true },
  })

  let subscriptionItemId: string

  if (user?.subscriptionId) {
    const subscriptionItem = await stripe.subscriptionItems.create({
      subscription: user!.subscriptionId,
      price: process.env.SUBSCRIPTION_PRODUCT_ID,
    })

    subscriptionItemId = subscriptionItem.id
  } else {
    const subscription = await stripe.subscriptions.create({
      customer: userId,
      items: [{ price: process.env.SUBSCRIPTION_PRODUCT_ID }],
    })

    await db.user.update({ where: { id: userId }, data: { subscriptionId: subscription.id } })

    subscriptionItemId = subscription.items.data[0].id
  }

  await db.project.create({
    data: {
      id: subscriptionItemId,
      slug,
      owner: {
        connect: {
          id: userId,
        },
      },
    },
  })
}
