import axios from "axios"

const apiKey = process.env.MAILCHIMP_API_KEY!
const listId = process.env.MAILCHIMP_NEWSLETTER_ID

const server = apiKey.split("-")[1]

const mailchimp = axios.create({
  baseURL: `https://${server}.api.mailchimp.com/3.0`,
})

export default async function subscribeToNewsletter({
  email,
  skipConfirm = false,
}: {
  email: string
  skipConfirm?: boolean
}) {
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
