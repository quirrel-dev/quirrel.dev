import Layout from "app/layouts/Layout"
import { BlitzPage, GetServerSideProps, InferGetServerSidePropsType, useRouter } from "blitz"
import * as passwordReset from "../../../reset-password"
import { Form, Field } from "react-final-form"
import setNewPassword from "../../../mutations/set-new-password"
import { FORM_ERROR } from "final-form"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = ctx.query.email as string
  const code = ctx.query.code as string

  return {
    props: {
      found: await passwordReset.isValidCode(email, code),
      code,
      email,
    },
  }
}

const ResetPassword: BlitzPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  const { found, code, email } = props

  const router = useRouter()

  if (!found) {
    return <div>"Not Found"</div>
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="max-w-md w-full py-12">
        <p className="mt-6 text-sm leading-5 text-center text-gray-900">Set a new Password</p>

        <Form
          onSubmit={async (values) => {
            try {
              await setNewPassword({
                email,
                code,
                newPassword: values.password,
              })

              router.push("/dashboard")
            } catch (error) {
              return { [FORM_ERROR]: error.toString() }
            }
          }}
          render={({ handleSubmit }) => (
            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm">
                <Field
                  name="password"
                  render={({ input }) => (
                    <div>
                      <input
                        {...input}
                        aria-label="Password"
                        className="border-gray-300 placeholder-gray-500 appearance-none rounded-none relative block w-full px-3 py-2 border text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                        placeholder="Password"
                        type="password"
                        required
                      />
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
                  Set Password
                </button>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  )
}

ResetPassword.getLayout = (page) => (
  <Layout hideLogin title="Reset Passsword">
    {page}
  </Layout>
)

export default ResetPassword
