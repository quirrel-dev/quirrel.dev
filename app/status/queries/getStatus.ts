import axios from "axios"

export default async function getStatus() {
  const { data } = await axios.get<string>("https://status.quirrel.dev")
  return data.includes("All services are online") ? "up" : "down"
}
