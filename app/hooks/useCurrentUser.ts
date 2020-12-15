import { useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"

export function useCurrentUser() {
  const [user] = useQuery(getCurrentUser, null)
  return user
}
