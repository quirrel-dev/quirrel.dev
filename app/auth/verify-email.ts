import { hashPassword, verifyPassword } from "./auth-utils"

export async function generateCode(secret: string) {
  return await hashPassword(secret)
}

export async function verifyCode(code: string, secret: string) {
  return await verifyPassword(code, secret)
}
