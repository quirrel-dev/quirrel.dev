import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import { verifyWebhook } from "../verifyWebhook"
import db from "db"
import * as mailchimp from "app/mailchimp"
import { SubscriptionPassthrough } from "../subscription-passthrough"

interface SubscriptionCreatedPayload {
  update_url: string
  cancel_url: string
  subscription_id: string
  marketing_consent: "0" | "1"
  email: string
  user_id: string
  passthrough: string
}

type EventState = "active" | "trialing" | "past_due" | "paused" | "deleted"

interface SubscriptionUpdatedPayload {
  subscription_id: string
  email: string
  user_id: string
  status: EventState
  passthrough: string
}

interface SubscriptionCanceledPayload {
  subscription_id: string
  email: string
  user_id: string
  cancellation_effective_date: string
  passthrough: string
}

interface NewAudienceMemberPayload {
  email: string
  marketing_consent: "0" | "1"
}

interface UpdateAudienceMemberPayload {
  email: string
  old_marketing_consent: "0" | "1"
  new_marketing_consent: "0" | "1"
  old_customer_email: string
  new_customer_email: string
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
        subscriptionPaused: false,
      },
    })

    console.log("Customer created subscription", { customerId })

    if (args.marketing_consent === "0") {
      return
    }

    await mailchimp.subscribeToNewsletter(args.email)
  },

  async subscription_updated(args: SubscriptionUpdatedPayload) {
    const { customerId } = parsePassthrough(args.passthrough)
    switch (args.status) {
      case "active": {
        await db.user.update({
          where: { id: customerId },
          data: { subscriptionId: args.subscription_id, subscriptionPaused: false },
        })
        console.log("Customer activated subscription", { customerId })
        break
      }
      case "paused": {
        await db.user.update({
          where: { id: customerId },
          data: { subscriptionPaused: true },
        })
        console.log("Customer paused subscription", { customerId })
        break
      }
      case "deleted": {
        await db.user.update({
          where: { id: customerId },
          data: { subscriptionId: null, subscriptionPaused: false },
        })
        console.log("Customer ended subscription", { customerId })
        break
      }
    }
  },

  async subscription_cancelled(args: SubscriptionCanceledPayload) {
    const { customerId } = parsePassthrough(args.passthrough)
    await db.user.update({
      where: { id: customerId },
      data: { subscriptionId: null, subscriptionPaused: false },
    })
    console.log("Customer cancelled subscription", { customerId })
  },

  async new_audience_member(args: NewAudienceMemberPayload) {
    const { email, marketing_consent } = args
    if (marketing_consent === "0") {
      return
    }

    await mailchimp.subscribeToNewsletter(email)
    console.log("Added user to newsletter", { email })
  },

  async update_audience_member(args: UpdateAudienceMemberPayload) {
    const {
      email,
      old_marketing_consent,
      new_marketing_consent,
      old_customer_email,
      new_customer_email,
    } = args

    if (old_marketing_consent !== new_marketing_consent) {
      if (new_marketing_consent === "0") {
        await mailchimp.archiveFromNewsletter(email)
        console.log("Archived user from newsletter", { email })
        return
      } else {
        await mailchimp.subscribeToNewsletter(email, true)
        console.log("Added user to newsletter", { email })
      }
    }

    if (old_customer_email !== new_customer_email) {
      await mailchimp.updateEmailAddress(old_customer_email, new_customer_email)
      console.log("Updated audience email", { old_customer_email, new_customer_email })
    }
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

  res.status(200).end()
}

export default paddleWebhook
