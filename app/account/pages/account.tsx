import { BlitzPage, useQuery } from "blitz"
import { Box, Heading, Meter } from "grommet"
import Layout from "app/layouts/Layout"
import getAccountData from "../queries/getAccountData"

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
    </Box>
  )
}

Account.getLayout = (page) => <Layout title="Account">{page}</Layout>

export default Account
