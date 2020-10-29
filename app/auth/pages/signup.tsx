import React from "react"
import { useRouter, BlitzPage, Link, useMutation } from "blitz"
import Layout from "app/layouts/Layout"
import signupMutation from "app/auth/mutations/signup"
import { Form, Field } from "react-final-form"
import { FORM_ERROR } from "final-form"
import { SignupInput } from "../validations"

const SignupPage: BlitzPage = () => {
  const router = useRouter()
  const [signup] = useMutation(signupMutation)

  return (
    <div className="min-h-screen flex justify-center">
      <div className="max-w-md w-full py-12">
        <p className="mt-6 text-sm leading-5 text-center text-gray-900">
          Sign Up for a new account
        </p>

        <Form
          onSubmit={async (values) => {
            try {
              const result = await signup({
                email: values.email,
                password: values.password,
                subscribeToNewsletter: values.marketing,
              })

              switch (result) {
                case "email_exists": {
                  return { email: "This email is already being used" }
                }
                case "success": {
                  router.push("/dashboard")
                  return
                }
                default: {
                  return { [FORM_ERROR]: result }
                }
              }
            } catch (error) {
              return { [FORM_ERROR]: error.toString() }
            }
          }}
          validate={(values) => {
            const errors: Record<string, string[]> = {}

            const result = SignupInput.safeParse({
              email: values.email,
              password: values.password,
              subscribeToNewsletter: values.marketing,
            })

            if (!result.success) {
              Object.assign(errors, result.error.flatten().fieldErrors)
            }

            if (!values.accept_terms) {
              errors.accept_terms = ["👈"]
            }

            return errors
          }}
          validateOnBlur
          render={({ handleSubmit, submitError }) => (
            <form className="mt-5" onSubmit={handleSubmit}>
              <div>
                <Field
                  name="email"
                  render={({ input, meta }) => (
                    <div className="-mt-px relative">
                      <input
                        {...input}
                        required
                        type="email"
                        placeholder="Email address"
                        aria-label="Email address"
                        className="border-gray-300 placeholder-gray-500 appearance-none rounded-none relative block w-full px-3 py-2 border text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                      />
                      {(meta.error || meta.submitError) && meta.touched && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-red-500 select-none cursor-default">
                          {meta.error || meta.submitError}
                        </div>
                      )}
                    </div>
                  )}
                />

                <Field
                  name="password"
                  render={({ input, meta }) => (
                    <div className="-mt-px relative">
                      <input
                        {...input}
                        aria-label="Password"
                        className="border-gray-300 placeholder-gray-500 appearance-none rounded-none relative block w-full px-3 py-2 border text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                        placeholder="Password"
                        type="password"
                        required
                      />
                      {(meta.error || meta.submitError) && meta.touched && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-red-500 select-none cursor-default">
                          {meta.error || meta.submitError}
                        </div>
                      )}
                    </div>
                  )}
                />

                <Field
                  name="accept_terms"
                  component="input"
                  type="checkbox"
                  className="mx-2 mt-2"
                  required
                />
                <label className="text-gray-600 text-sm" htmlFor="accept_terms">
                  I accept Quirrel's{" "}
                  <a href="/terms" target="_blank" rel="noreferrer" className="text-blue-700">
                    terms of use
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank" rel="noreferrer" className="text-blue-700">
                    privacy policy
                  </a>
                  .
                </label>

                <br />

                <Field
                  name="marketing"
                  component="input"
                  type="checkbox"
                  className="mx-2 mt-2"
                  initialValue={true}
                />
                <label className="text-gray-600 text-sm" htmlFor="marketing">
                  Send me news & updates on Quirrel.
                </label>
              </div>

              {submitError && <div className="text-red-500 m-4">{submitError}</div>}
              <div className="mt-5">
                <button
                  type="submit"
                  className="relative block w-full py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-600 hover:bg-gray-700 focus:bg-gray-800 focus:outline-none focus:shadow-outline sm:text-sm sm:leading-5"
                >
                  <span className="absolute left-0 inset-y pl-3">
                    <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  Sign up
                </button>
              </div>
            </form>
          )}
        />

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm leading-5">
              <span className="px-2 bg-white text-black-500">Already have an account?</span>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/login">
              <a className="block w-full text-center py-2 px-3 border border-gray-300 rounded-md text-gray-900 font-medium hover:border-gray-400 focus:outline-none focus:border-gray-400 sm:text-sm sm:leading-5">
                Log in
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

SignupPage.getLayout = (page) => (
  <Layout title="Sign Up" hideLogin>
    {page}
  </Layout>
)

export default SignupPage
