import { BlitzPage, Router, useQuery } from "blitz"
import { Anchor, Box, Heading, Meter, Button } from "grommet"
import Layout from "app/layouts/Layout"
import getAccountData from "../queries/getAccountData"
import getBillingPortalLink from "../../stripe/queries/getBillingPortalLink"
import deleteAccount from "../mutations/deleteAccount"

const maxFree = 10_000

const Account: BlitzPage = () => {
  const [accountData] = useQuery(getAccountData, null)
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

      <Button
        onClick={async () => {
          const sure = window.confirm("You sure?")

          if (sure) {
            await deleteAccount()
            Router.push("/")
          }
        }}
        label="Delete Account"
      />
    </Box>
  )
}

Account.getLayout = (page) => <Layout title="Account">{page}</Layout>

export default Account
