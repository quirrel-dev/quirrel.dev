import { Elements, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CardElement } from "@stripe/react-stripe-js"
import { Form, Button } from "grommet"
import addPaymentMethod from "app/stripe/mutations/addPaymentMethod"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function SetupPayment() {
  const elements = useElements()
  const stripe = useStripe()
  return (
    <Form
      onSubmit={async () => {
        const cardElement = elements?.getElement(CardElement)
        if (!cardElement) {
          return
        }
        const result = await stripe!.createPaymentMethod({
          card: cardElement,
          type: "card",
        })

        if (result?.error) {
          alert(JSON.stringify(result.error))
          return
        }

        await addPaymentMethod({ paymentMethodId: result.paymentMethod!.id })
      }}
    >
      <CardElement />
      <Button type="submit" label="submit" />
    </Form>
  )
}

export default function SetupPaymentForm() {
  return (
    <Elements stripe={stripePromise}>
      <SetupPayment />
    </Elements>
  )
}
