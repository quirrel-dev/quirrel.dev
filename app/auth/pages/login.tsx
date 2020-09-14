import React, { useEffect } from "react"
import { useRouter, BlitzPage, Router } from "blitz"
import Layout from "app/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  useEffect(() => {
    Router.prefetch("/dashboard")
  }, [])

  return <LoginForm onSuccess={() => router.push("/dashboard")} />
}

LoginPage.getLayout = (page) => (
  <Layout title="Log In" hideLogin>
    {page}
  </Layout>
)

export default LoginPage
