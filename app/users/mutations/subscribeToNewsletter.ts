import { resolver } from "blitz"
import * as mailchimp from "app/mailchimp"
import * as z from "zod"

export default resolver.pipe(
  resolver.zod(z.object({ email: z.string(), hasConsented: z.boolean() })),
  async ({ email, hasConsented }) => {
    await mailchimp.subscribeToNewsletter(email, hasConsented)
  }
)
