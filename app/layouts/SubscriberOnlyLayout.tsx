import Layout, { LayoutProps } from "./Layout"
import SetupPaymentForm from "app/stripe/components/SetupPaymentForm"
import { useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"

export function SubscriberOnlyLayout(props: LayoutProps) {
  const [user, userMeta] = useQuery(getCurrentUser, null)
  if (user?.hasDefaultPaymentMethod === false) {
    return (
      <Layout title="Please Subscribe">
        <SetupPaymentForm onSuccess={() => userMeta.refetch()} />
      </Layout>
    )
  }
  return <Layout {...props} />
}
