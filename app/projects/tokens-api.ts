import axios from "axios"

const quirrelApi = axios.create({
  baseURL: process.env.QUIRREL_API || "https://api.quirrel.dev",
  auth: {
    username: "ignored",
    password: process.env.QUIRREL_PASSPHRASE!,
  },
})

export async function create(name: string) {
  const { data: token } = await quirrelApi.put(`/tokens/${name}`, {})
  return token
}

export async function revoke(name: string) {
  await quirrelApi.delete(`/tokens/${name}`)
}
