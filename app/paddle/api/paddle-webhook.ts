import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import { verifyWebhook } from "../verifyWebhook"
import db from "db"

interface SubscriptionCreatedPayload {
  update_url: string
  cancel_url: string
  subscription_id: string
  email: string
  user_id: string
  passthrough: string
}

type EventState = "active" | "trialing" | "past_due" | "paused" | "deleted"

interface SubscriptionUpdatedPayload {
  subscription_id: string
  email: string
  user_id: string
  state: EventState
  passthrough: string
}

interface SubscriptionCanceledPayload {
  subscription_id: string
  email: string
  user_id: string
  cancellation_effective_date: string
  passthrough: string
}

interface SubscriptionPassthrough {
  customerId: string
}
function parsePassthrough(passthrough: string): SubscriptionPassthrough {
  return JSON.parse(passthrough)
}

const hooks: Record<string, (args: any) => Promise<void>> = {
  async subscription_created(args: SubscriptionCreatedPayload) {
    const { customerId } = parsePassthrough(args.passthrough)
    await db.user.update({
      where: { id: customerId },
      data: {
        subscriptionId: args.subscription_id,
        subscriptionCancelURL: args.cancel_url,
        subscriptionUpdateURL: args.update_url,
      },
    })
  },

  async subscription_updated(args: SubscriptionUpdatedPayload) {
    const { customerId } = parsePassthrough(args.passthrough)
    switch (args.state) {
      case "active": {
        await db.user.update({
          where: { id: customerId },
          data: { subscriptionId: args.subscription_id },
        })
      }
      case "paused": {
        await db.user.update({
          where: { id: customerId },
          data: { subscriptionPaused: true },
        })
        break
      }
      case "deleted": {
        await db.user.update({
          where: { id: customerId },
          data: { subscriptionId: null },
        })
        break
      }
    }
  },

  async subscription_canceled(args: SubscriptionCanceledPayload) {
    const { customerId } = parsePassthrough(args.passthrough)
    await db.user.update({
      where: { id: customerId },
      data: { subscriptionId: null },
    })
  },
}

async function paddleWebhook(req: BlitzApiRequest, res: BlitzApiResponse) {
  if (!verifyWebhook(req.body)) {
    res.status(401).end()
  }

  const handler = hooks[req.body.alert_name]

  if (handler) {
    await handler(req.body)
  }
}

export default paddleWebhook
