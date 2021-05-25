import axios from "axios"

export default async function getStatus() {
  try {
    const { data } = await axios.get<string>("https://status.quirrel.dev")
    return data.includes("All services are online") ? "up" : "down"
  } catch (error) {
    console.error(error)
    return "down"
  }
}
