import { url } from "./url"

test("url", () => {
  process.env.BASE_URL = "https://console.quirrel.dev"

  expect(url`/verifyMail/${1234}`).toBe("https://console.quirrel.dev/verifyMail/1234")
})
