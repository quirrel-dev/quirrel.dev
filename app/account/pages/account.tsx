import { BlitzPage, useQuery } from "blitz"
import { Anchor, Box, Heading, Meter } from "grommet"
import Layout from "app/layouts/Layout"
import getAccountData from "../queries/getAccountData"
import getBillingPortalLink from "../../stripe/queries/getBillingPortalLink"

const maxFree = 10_000

const Account: BlitzPage = () => {
  const [accountData] = useQuery(getAccountData, {})
  return (
    <Box>
      <Heading>{accountData?.email}'s account</Heading>

      <Meter
        type="circle"
        round
        max={maxFree}
        values={[
          {
            value: 7_000,
            label: "invocations",
          },
        ]}
      />

      <Anchor
        onClick={async () => {
          const url = await getBillingPortalLink({
            returnUrl: window.location.href,
          })

          window.location.href = url
        }}
      >
        Billing Portal
      </Anchor>
    </Box>
  )
}

Account.getLayout = (page) => <Layout title="Account">{page}</Layout>

export default Account
