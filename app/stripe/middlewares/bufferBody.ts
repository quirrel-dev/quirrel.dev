import bodyParser from "body-parser"
import type { NextApiHandler } from "next"

const buffer = bodyParser.raw({ type: "application/json" })

/**
 * Adds `cookie` function on `res.cookie` to set cookies for response
 */
const bufferBody = (handler: NextApiHandler): NextApiHandler => {
  return (req, res) => {
    return new Promise<void>((resolve) => {
      buffer(req, res, async () => {
        await handler(req, res)
        resolve()
      })
    })
  }
}

export default bufferBody
