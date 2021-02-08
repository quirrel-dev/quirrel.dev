import { Router, useMutation, useQuery } from "blitz"
import logoutMutation from "app/auth/mutations/logout"
import getCurrentUser from "app/users/queries/getCurrentUser"

interface LoginStateProps {
  children: (info: {
    onClick: () => void
    isLoggedIn: boolean
    email?: string
    isLoading: boolean
  }) => JSX.Element
}

export function LoginState(props: LoginStateProps) {
  const [currentUser, { isLoading }] = useQuery(getCurrentUser, null, { suspense: false })
  const [logout] = useMutation(logoutMutation)

  if (!currentUser) {
    return props.children({
      onClick: async () => {
        Router.push("/login")
      },
      isLoggedIn: false,
      email: undefined,
      isLoading,
    })
  } else {
    return props.children({
      onClick: async () => {
        await logout()
        Router.push("/")
      },
      isLoggedIn: true,
      email: currentUser.email,
      isLoading,
    })
  }
}
