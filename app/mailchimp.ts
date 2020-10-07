import axios from "axios"
import * as hash from "utils/hash"

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

export async function archiveFromNewsletter(email: string) {
  await mailchimp.delete(`/lists/${listId}/members/${hash.md5(email.toLowerCase())}`, {
    auth: {
      username: "key",
      password: apiKey,
    },
    validateStatus: (status) => [204, 400].includes(status),
  })
}

export async function updateEmailAddress(oldEmail: string, newEmail: string) {
  await mailchimp.patch(
    `/lists/${listId}/members/${hash.md5(oldEmail.toLowerCase())}`,
    {
      email: newEmail,
    },
    {
      auth: {
        username: "key",
        password: apiKey,
      },
      validateStatus: (status) => [204, 400].includes(status),
    }
  )
}
