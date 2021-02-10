import { resolver } from "@blitzjs/core"
import * as passwordReset from "../reset-password"
import z from "zod"

export default resolver.pipe(resolver.zod(z.object({ email: z.string() })), async ({ email }) => {
  await passwordReset.invoke(email)
})
