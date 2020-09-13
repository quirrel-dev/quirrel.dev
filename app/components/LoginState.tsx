import { useCurrentUser } from "app/hooks/useCurrentUser"
import { Router } from "blitz"
import logout from "app/auth/mutations/logout"

interface LoginStateProps {
  children: (info: { onClick: () => void; isLoggedIn: boolean }) => JSX.Element
}

export function LoginState(props: LoginStateProps) {
  const currentUser = useCurrentUser()

  if (!currentUser) {
    return props.children({
      onClick: async () => {
        Router.push("/login")
      },
      isLoggedIn: false,
    })
  } else {
    return props.children({
      onClick: async () => {
        await logout()
        Router.push("/")
      },
      isLoggedIn: true,
    })
  }
}
