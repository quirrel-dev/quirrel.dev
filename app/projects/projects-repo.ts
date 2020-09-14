import { stripe } from "app/stripe/stripe"
import db from "db"
import * as TokensRepo from "./tokens-repo"

export async function remove(slug: string, userId: string) {
  await TokensRepo.removeAllFromProject(userId, slug)

  await db.project.update({
    where: { ownerId_slug: { ownerId: userId, slug } },
    data: { isActive: false },
  })
}

export async function removeByOwnerId(ownerId: string) {
  await TokensRepo.removeAllFromUser(ownerId)

  await db.project.updateMany({ where: { ownerId }, data: { isActive: false } })
}

export async function create(slug: string, userId: string) {
  const slugExists = await db.project.count({
    where: { slug, ownerId: userId, isActive: true },
  })

  if (slugExists) {
    return "slug_exists"
  }

  const user = await db.user.findOne({
    where: { id: userId },
    select: { subscriptionId: true },
  })

  if (!user?.subscriptionId) {
    const subscription = await stripe.subscriptions.create({
      customer: userId,
      items: [{ price: process.env.SUBSCRIPTION_PRICE_ID }],
    })

    await db.user.update({ where: { id: userId }, data: { subscriptionId: subscription.id } })
  }

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
