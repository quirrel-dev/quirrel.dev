import * as crypto from "crypto"
import * as PhpSerialize from "php-serialize"

function ksort(obj: Record<string, string>): Record<string, string> {
  const keys = Object.keys(obj).sort()
  let sortedObj = {}
  for (let i in keys) {
    sortedObj[keys[i]] = obj[keys[i]]
  }
  return sortedObj
}

const paddlePublicKey = Buffer.from(process.env.PADDLE_PUBLIC_KEY!, "base64")

export function verifyWebhook(query: Record<string, string>) {
  const mySig = Buffer.from(query.p_signature, "base64")
  delete query.p_signature

  query = ksort(query)

  for (let property in query) {
    if (query.hasOwnProperty(property) && typeof query[property] !== "string") {
      if (Array.isArray(query[property])) {
        query[property] = query[property].toString()
      } else {
        query[property] = JSON.stringify(query[property])
      }
    }
  }

  const serialized = PhpSerialize.serialize(query)

  const verifier = crypto.createVerify("sha1")
  verifier.update(serialized)
  verifier.end()

  const verification = verifier.verify(paddlePublicKey, mySig)

  return verification
}
