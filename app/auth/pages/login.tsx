import React, { useEffect } from "react"
import { useRouter, BlitzPage, Router } from "blitz"
import Layout from "app/layouts/Layout"
import { Form, Field, FormSpy } from "react-final-form"
import { FORM_ERROR } from "final-form"
import login from "app/auth/mutations/login"
import { Link } from "blitz"
import resetPassword from "../mutations/reset-password"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  useEffect(() => {
    Router.prefetch("/dashboard")
  }, [])

  return (
    <div className="min-h-screen flex justify-center">
      <div className="max-w-md w-full py-12">
        <p className="mt-6 text-sm leading-5 text-center text-gray-900">Log in to your account</p>

        <Form
          onSubmit={async (values) => {
            try {
              await login({ email: values.email, password: values.password })
              router.push("/dashboard")
            } catch (error) {
              if (error.name === "AuthenticationError") {
                return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
              } else {
                return {
                  [FORM_ERROR]:
                    "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
                }
              }
            }
          }}
          render={({ handleSubmit }) => (
            <form className="mt-5" data-bitwarden-watching="1" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm">
                <Field
                  name="email"
                  type="email"
                  render={({ input }) => (
                    <div>
                      <input
                        {...input}
                        required
                        type="email"
                        placeholder="Email address"
                        aria-label="Email address"
                        className="border-gray-300 placeholder-gray-500 appearance-none rounded-none relative block w-full px-3 py-2 border text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                      />
                    </div>
                  )}
                />

                <Field
                  name="password"
                  render={({ input }) => (
                    <div className="-mt-px relative">
                      <input
                        {...input}
                        aria-label="Password"
                        className="border-gray-300 placeholder-gray-500 appearance-none rounded-none relative block w-full px-3 py-2 border text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                        placeholder="Password"
                        type="password"
                        required
                      />

                      <FormSpy>
                        {(props) => (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                            <button
                              className="text-gray-900 underline"
                              onClick={async (evt) => {
                                evt.preventDefault()
                                const { email } = props.values

                                if (!email) {
                                  props.form.focus("email")
                                  return
                                }

                                await resetPassword({ email })
                                window.alert("You'll receive an e-mail shortly.")
                              }}
                            >
                              Forgot?
                            </button>
                          </div>
                        )}
                      </FormSpy>
                    </div>
                  )}
                />
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  className="relative block w-full py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-700 hover:bg-gray-600 focus:bg-gray-800 focus:outline-none focus:shadow-outline sm:text-sm sm:leading-5"
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
                  Log in
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
              <span className="px-2 bg-white text-black-500">Don't have an account?</span>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/signup">
              <a className="block w-full text-center py-2 px-3 border border-gray-300 rounded-md text-gray-900 font-medium hover:border-gray-400 focus:outline-none focus:border-gray-400 sm:text-sm sm:leading-5">
                Sign Up
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

LoginPage.getLayout = (page) => (
  <Layout title="Log In" hideLogin>
    {page}
  </Layout>
)

export default LoginPage
