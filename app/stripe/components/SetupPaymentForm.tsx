import { Elements, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import {
  CardElement,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js"
import addPaymentMethod from "app/stripe/mutations/addPaymentMethod"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function SetupPayment() {
  const elements = useElements()
  const stripe = useStripe()

  return (
    <div className="min-h-screen flex justify-center">
      <div className="max-w-md w-1/2 py-12 px-6">
        <p className="my-6 text-sm leading-5 text-center text-gray-900">Add Payment Method</p>
        <form
          onSubmit={async (evt) => {
            evt.preventDefault()

            const cardNumberElement = elements?.getElement(CardNumberElement)
            if (!cardNumberElement) {
              return
            }

            const cardCvcElement = elements?.getElement(CardCvcElement)
            if (!cardCvcElement) {
              return
            }

            const cardExpiryElement = elements?.getElement(CardExpiryElement)
            if (!cardExpiryElement) {
              return
            }

            const result = await stripe!.createPaymentMethod({
              card: cardNumberElement,
              type: "card",
            })

            if (result?.error) {
              alert(JSON.stringify(result.error))
              return
            }

            await addPaymentMethod({ paymentMethodId: result.paymentMethod!.id })
          }}
        >
          <div className="rounded-md shadow-sm">
            <div>
              <CardNumberElement className="border-gray-300 placeholder-gray-500 appearance-none rounded-none relative block w-full px-3 py-2 border text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" />
            </div>

            <div>
              <CardExpiryElement className="border-gray-300 placeholder-gray-500 appearance-none rounded-none relative inline-block w-1/2 px-3 py-2 border text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" />
              <CardCvcElement className="border-gray-300 placeholder-gray-500 appearance-none rounded-none relative inline-block w-1/2 px-3 py-2 border text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" />
            </div>
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="relative block w-full py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-700 hover:bg-gray-600 focus:bg-gray-800 focus:outline-none focus:shadow-outline sm:text-sm sm:leading-5"
            >
              <span className="absolute left-0 inset-y pl-3">
                <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
              Add Card
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SetupPaymentForm() {
  return (
    <Elements stripe={stripePromise}>
      <SetupPayment />
    </Elements>
  )
}
