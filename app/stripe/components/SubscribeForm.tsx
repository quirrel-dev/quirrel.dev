import { useCurrentUser } from "app/hooks/useCurrentUser"
import SetupPaymentForm from "./SetupPaymentForm"
import { Box, Button } from "grommet"
import createSubscription from "../mutations/createSubscription"

export function SubscribeForm() {
  const user = useCurrentUser()

  if (!user?.hasDefaultPaymentMethod) {
    return <SetupPaymentForm />
  }

  return (
    <Box>
      <Button
        label="Subscribe"
        onClick={async () => {
          await createSubscription()
        }}
      />
    </Box>
  )
}
