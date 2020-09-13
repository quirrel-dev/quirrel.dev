import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import type Stripe from "stripe"
import bufferBody from "../middlewares/bufferBody"
import { stripe } from "../stripe"
import { unsubscribe } from "../unsubscribe"
import { updateDefaultPaymentMethod } from "../updateDefaultPaymentMethod"

async function stripeWebhook(req: BlitzApiRequest, res: BlitzApiResponse) {
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
    return res.status(400).end()
  }

  switch (event.type) {
    case "customer.subscription.deleted": {
      const object = event.data.object as { customer: string }
      await unsubscribe(object.customer)

      break
    }

    case "customer.updated": {
      const object = event.data.object as {
        id: string
        invoice_settings: { default_payment_method: string | null }
      }

      await updateDefaultPaymentMethod(object.id, object.invoice_settings.default_payment_method)

      break
    }
  }

  res.status(200).end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default bufferBody(stripeWebhook)
