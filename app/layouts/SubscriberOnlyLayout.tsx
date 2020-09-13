import { useIsSubscriber } from "app/hooks/useCurrentUser"
import Layout, { LayoutProps } from "./Layout"
import { SubscribeForm } from "app/stripe/components/SubscribeForm"

export function SubscriberOnlyLayout(props: LayoutProps) {
  const isSubscriber = useIsSubscriber()
  if (!isSubscriber) {
    return (
      <Layout title="Please Subscribe">
        <SubscribeForm />
      </Layout>
    )
  }
  return <Layout {...props} />
}
