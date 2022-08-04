import { BlitzPage, useQuery, Router, useMutation, Head } from "blitz"
import getProjectSlugs from "app/projects/queries/getProjectSlugs"
import createProjectMutation from "app/projects/mutations/createProject"
import React, { Suspense, useEffect, useState } from "react"
import { isValidSlug } from "../slug"
import { SubscriberOnlyLayout } from "app/layouts/SubscriberOnlyLayout"
import { Modal } from "app/components/Modal"
import { Form, Field } from "react-final-form"
import deleteAccountMutation from "app/account/mutations/deleteAccount"
import { CardList } from "app/components/CardList"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import { usePaddle } from "app/hooks/usePaddle"
import { SubscriptionPassthrough } from "app/paddle/subscription-passthrough"
import { UsageQuota } from "../components/UsageQuota"

function DeleteAccountButton() {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
  const [deleteAccount] = useMutation(deleteAccountMutation)
  return (
    <>
      <Modal show={showDeleteAccountModal}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                Delete account
              </h3>
              <div className="mt-2">
                <p className="text-sm leading-5 text-gray-500">
                  Are you sure you want to delete your account? Your projects will lose Quirrel
                  access immediately. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              onClick={async () => {
                await deleteAccount()
                Router.push("/")
              }}
            >
              Delete
            </button>
          </span>
          <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              onClick={() => setShowDeleteAccountModal(false)}
            >
              Cancel
            </button>
          </span>
        </div>
      </Modal>
      <a
        className="font-semibold text-red-500 hover:text-red-600 transition ease-in-out duration-150"
        role="button"
        tabIndex={-1}
        onClick={() => setShowDeleteAccountModal(true)}
        onKeyDown={() => setShowDeleteAccountModal(true)}
      >
        Delete Account
      </a>
    </>
  )
}

function PaddleScripts() {
  return (
    <Head>
      <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
    </Head>
  )
}

function AccountSection() {
  const user = useCurrentUser()
  const paddle = usePaddle()

  useEffect(() => {
    paddle?.Setup({ vendor: 121877 })
  }, [paddle])

  function upgrade() {
    const passthrough: SubscriptionPassthrough = {
      customerId: user!.id,
    }
    paddle?.Checkout.open({
      product: 631848,
      email: user?.email,
      passthrough: JSON.stringify(passthrough),
    })
  }

  return (
    <section id="account" className="mt-24">
      <PaddleScripts />

      <h1 className="text-4xl font-semibold text-gray-900 sm:text-xl sm:leading-7">Account</h1>

      <ul className="space-y-2 mt-2">
        <li>
          <Suspense fallback="Loading usage Quota ...">
            <UsageQuota />
          </Suspense>
        </li>

        {user?.isSubscriber && (
          <>
            <li>
              <a
                href={user.updateURL ?? ""}
                className="font-semibold text-teal-500 hover:text-teal-700 transition ease-in-out duration-150"
                role="button"
                tabIndex={-1}
              >
                Update Payment Details
              </a>
            </li>
            <li>
              <a
                href={user.cancelURL ?? ""}
                className="font-semibold text-orange-500 hover:text-orange-700 transition ease-in-out duration-150"
                role="button"
                tabIndex={-1}
              >
                Downgrade Plan
              </a>
            </li>
          </>
        )}

        <li>
          <DeleteAccountButton />
        </li>
      </ul>
    </section>
  )
}

const Dashboard: BlitzPage = () => {
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [projectSlugs] = useQuery(getProjectSlugs, {})
  const [createProject] = useMutation(createProjectMutation)

  return (
    <div className="lg:mx-auto max-w-screen-md">
      <div className="space-y-4">
        <Modal show={showCreateProject}>
          <Form
            onSubmit={async (values) => {
              const { name } = values

              const url = "/projects/" + name

              Router.prefetch(url)

              await createProject(name)

              Router.push(url)
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        className="h-6 w-6 text-orange-600"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-headline"
                      >
                        Create new project
                      </h3>
                      <div className="mt-4">
                        <p className="text-md leading-5 text-gray-500">
                          Choose an URL-compatible project name.
                        </p>
                      </div>
                      <div className="mt-4">
                        <Field
                          name="name"
                          validate={(value) => {
                            if (!value) {
                              return "must not be empty"
                            }

                            if (!isValidSlug(value)) {
                              return "Invalid Format"
                            }

                            if (projectSlugs.includes(value)) {
                              return "Project already exists"
                            }
                          }}
                        >
                          {({ input, meta }) => (
                            <div>
                              <input
                                {...input}
                                required
                                autoCapitalize="off"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}
                                placeholder="Project name"
                                aria-label="project name"
                                className="border-gray-300 placeholder-gray-500 appearance-none relative block w-full px-3 py-2 border text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                              />
                              {meta.touched && meta.error && <span>{meta.error}</span>}
                            </div>
                          )}
                        </Field>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                    <button
                      type="submit"
                      className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                    >
                      Create
                    </button>
                  </span>
                  <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                      onClick={() => setShowCreateProject(false)}
                    >
                      Cancel
                    </button>
                  </span>
                </div>
              </form>
            )}
          </Form>
        </Modal>

        <div className="rounded border-red-300 border bg-red-100 p-4 text-center max-w-lg m-auto">
          <p>
            As notified, the hosted instance of Quirrel (this site!) is currently shutting down. If your application still relies on
            it, please reach out to{" "}
            <a
              href="mailto:migration@quirrel.dev"
              target="_blank"
              className="text-red-600 hover:text-red-900"
            >
              migration@quirrel.dev
            </a>
            .
          </p>
        </div>

        {projectSlugs.length === 0 && (
          <div className="rounded border-orange-300 border bg-orange-100 p-4 text-center max-w-lg m-auto">
            <p>Thanks for signing up to Quirrel! Glad to have you here.</p>

            <p className="pt-4">
              To get started, check out the{" "}
              <a
                href="https://docs.quirrel.dev"
                target="_blank"
                className="text-orange-600 hover:text-orange-900"
              >
                Quirrel Docs
              </a>
              .
            </p>

            <p className="pt-4">
              If you've got any questions (or just wanna chat), reach out via{" "}
              <a
                href="https://twitter.com/skn0tt"
                target="_blank"
                className="text-orange-600 hover:text-orange-900"
              >
                Twitter
              </a>{" "}
              or{" "}
              <a
                href="mailto:support@quirrel.dev"
                target="_blank"
                className="text-orange-600 hover:text-orange-900"
              >
                email
              </a>
              .
            </p>
          </div>
        )}

        <h1 className="text-xl font-semibold text-gray-900 leading-7">Projects</h1>

        <CardList
          emptyText="Once you're ready to deploy, create your first project using the button below."
          items={projectSlugs.map((slug) => ({
            title: slug,
            href: `/projects/${slug}`,
          }))}
        />

        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center float-right"
          onClick={() => setShowCreateProject(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="fill-current w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Create Project</span>
        </button>
      </div>

      <AccountSection />
    </div>
  )
}

Dashboard.getLayout = (page) => <SubscriberOnlyLayout>{page}</SubscriberOnlyLayout>

export default Dashboard
