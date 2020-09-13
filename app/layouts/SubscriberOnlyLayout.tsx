import { useHasDefaultPaymentMethod } from "app/hooks/useCurrentUser"
import Layout, { LayoutProps } from "./Layout"
import SetupPaymentForm from "app/stripe/components/SetupPaymentForm"

export function SubscriberOnlyLayout(props: LayoutProps) {
  const hasDefaultPaymentMethod = useHasDefaultPaymentMethod()
  if (!hasDefaultPaymentMethod) {
    return (
      <Layout title="Please Subscribe">
        <SetupPaymentForm />
      </Layout>
    )
  }
  return <Layout {...props} />
}
