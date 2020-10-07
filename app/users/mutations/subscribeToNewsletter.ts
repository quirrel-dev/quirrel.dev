import * as mailchimp from "app/mailchimp"

interface SubscribeToNewsletterArgs {
  email: string
  hasConsented: boolean
}

export default async function subscribeToNewsletter({
  email,
  hasConsented,
}: SubscribeToNewsletterArgs) {
  await mailchimp.subscribeToNewsletter(email, hasConsented)
}
