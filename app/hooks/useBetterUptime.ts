import { useQuery } from "react-query"

export function useBetterUptime() {
  const { data } = useQuery("better-uptime", () =>
    fetch("https://cors-anywhere.herokuapp.com/https://status.quirrel.dev").then((res) =>
      res.text()
    )
  )

  return data?.includes("All services are online")
}
