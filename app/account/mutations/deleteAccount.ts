import * as account from "../"
import { resolver } from "blitz"

export default resolver.pipe(resolver.authorize(), async (_, { session }) => {
  await account.deactivate(session.userId)

  await session!.$revoke()
})
