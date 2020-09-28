import Layout, { LayoutProps } from "./Layout"
import { useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"

export function SubscriberOnlyLayout(props: LayoutProps) {
  const [user] = useQuery(getCurrentUser, null)
  if (user?.emailIsVerified === false) {
    return (
      <Layout title="Please verify E-Mail">
        <div className="h-64 flex justify-center items-center">
          <div role="alert">
            <div className="bg-orange-500 text-white font-bold rounded-t px-4 py-2">Welcome!</div>
            <div className="border border-t-0 border-orange-400 rounded-b bg-orange-100 px-4 py-3">
              <p>We sent you an e-mail verification, it should arrive any second.</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return <Layout {...props} />
}
