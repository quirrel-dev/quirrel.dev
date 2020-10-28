import { useCurrentUser } from "app/hooks/useCurrentUser"
import { Router, useMutation } from "blitz"
import logoutMutation from "app/auth/mutations/logout"

interface LoginStateProps {
  children: (info: { onClick: () => void; isLoggedIn: boolean; email?: string }) => JSX.Element
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
      email: undefined,
    })
  } else {
    return props.children({
      onClick: async () => {
        await logout()
        Router.push("/")
      },
      isLoggedIn: true,
      email: currentUser.email,
    })
  }
}
