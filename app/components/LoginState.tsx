import { useCurrentUser } from "app/hooks/useCurrentUser"
import { Router, useMutation } from "blitz"
import logoutMutation from "app/auth/mutations/logout"

interface LoginStateProps {
  children: (info: { onClick: () => void; isLoggedIn: boolean }) => JSX.Element
}

export function LoginState(props: LoginStateProps) {
  const currentUser = useCurrentUser()
  const [logout] = useMutation(logoutMutation)

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
