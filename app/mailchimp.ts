import axios from "axios"

const apiKey = process.env.MAILCHIMP_API_KEY!
const listId = process.env.MAILCHIMP_LIST_ID

const server = apiKey.split("-")[1]

const mailchimp = axios.create({
  baseURL: `https://${server}.api.mailchimp.com/3.0`,
})

export async function subscribeToNewsletter(email: string, skipConfirm = false) {
  await mailchimp.post(
    `/lists/${listId}/members`,
    {
      email_address: email,
      status: skipConfirm ? "subscribed" : "pending",
    },
    {
      auth: {
        username: "key",
        password: apiKey,
      },
      validateStatus: (status) => [200, 400].includes(status),
    }
  )
}
