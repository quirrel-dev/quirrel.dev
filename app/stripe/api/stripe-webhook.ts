import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import type Stripe from "stripe"
import { stripe } from "../stripe"

export default async function stripeWebhook(req: BlitzApiRequest, res: BlitzApiResponse) {
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"] as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.log(error)
    console.log(`⚠️  Webhook signature verification failed.`)
    console.log(`⚠️  Check the env file and enter the correct webhook secret.`)
    return res.status(400)
  }

  switch (event.type) {
    case "invoice.payment_failed": {
      // do nothing
    }
  }
}
