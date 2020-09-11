import { useCurrentUser } from "app/hooks/useCurrentUser"
import { Link, Router } from "blitz"
import { Button, Anchor, Box } from "grommet"
import logout from "app/auth/mutations/logout"

export function LoginState() {
  const currentUser = useCurrentUser()

  if (!currentUser) {
    return (
      <Link href="/login">
        <Button secondary label="sign in" />
      </Link>
    )
  } else {
    return (
      <Box direction="row" align="center" gap="medium">
        <Link href="/projects">
          <Anchor>Projects</Anchor>
        </Link>

        <Link href="/account">
          <Anchor>Account</Anchor>
        </Link>
        <Button
          label="logout"
          onClick={async () => {
            await logout()
            Router.push("/")
          }}
        />
      </Box>
    )
  }
}
