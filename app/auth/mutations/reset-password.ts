import { resolver } from "blitz"
import * as passwordReset from "../reset-password"
import * as z from "zod"

export default resolver.pipe(resolver.zod(z.object({ email: z.string() })), async ({ email }) => {
  await passwordReset.invoke(email)
})
