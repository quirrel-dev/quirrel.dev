import React from "react"
import { useRouter, BlitzPage, Link } from "blitz"
import Layout from "app/layouts/Layout"
import { Form, FORM_ERROR } from "app/components/Form"
import { LabeledTextField } from "app/components/LabeledTextField"
import signup from "app/auth/mutations/signup"
import { SignupInput, SignupInputType } from "app/auth/validations"
import { Heading, Box } from "grommet"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <Box>
      <Heading>Create an Account</Heading>

      <Form<SignupInputType>
        submitText="Create Account"
        schema={SignupInput}
        onSubmit={async (values) => {
          try {
            await signup({ email: values.email, password: values.password })
            router.push("/projects")
          } catch (error) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" type="email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
      </Form>
    </Box>
  )
}

SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
