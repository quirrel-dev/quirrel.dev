import Axios from "axios"

export async function sendHeartbeat(getUrl: () => string | undefined) {
  const url = getUrl()
  if (!url) {
    console.error("Heartbeat disabled, please specify " + getUrl.toString().slice(6))
    return
  }

  await Axios.post(url)
}
