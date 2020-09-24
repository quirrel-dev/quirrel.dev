import * as passwordReset from "../reset-password"

export default async function resetPassword({ email }: { email: string }) {
  await passwordReset.invoke(email)
}
