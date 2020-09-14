import { useParam, useQuery, BlitzPage, Router, Link } from "blitz"
import getProject from "app/projects/queries/getProject"
import addToken from "app/projects/mutations/addToken"
import Layout from "app/layouts/Layout"
import deleteProject from "app/projects/mutations/deleteProject"
import { useState } from "react"
import { Modal } from "app/components/Modal"
import { Form, Field } from "react-final-form"
import { CardList } from "app/components/CardList"

const SpecificProject: BlitzPage = () => {
  const slug = useParam("slug") as string

  const [showCreateToken, setShowCreateToken] = useState(false)
  const [showDeleteProject, setShowDeleteProject] = useState(false)

  const [project, projectMeta] = useQuery(getProject, { slug })
  if (!project) {
    return <p>Not Found.</p>
  }

  const tokenNames = project.tokens.map((t) => t.name) ?? []

  return (
    <div className="mt-4 max-w-screen-md mx-8 lg:mx-auto">
      <div className="space-y-4">
        <Modal show={showCreateToken}>
          <Form
            onSubmit={async (values) => {
              const { name } = values

              setShowCreateToken(false)
              const token = await addToken({ projectSlug: project.slug, name })
              await projectMeta.refetch()

              Router.push(`/projects/${project.slug}/clients/${name}#${token}`)
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        className="h-6 w-6 text-indigo-600"
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
                        Add client
                      </h3>
                      <div className="mt-4">
                        <p className="text-md leading-5 text-gray-500">Give your client a name.</p>
                      </div>
                      <div className="mt-4">
                        <Field
                          name="name"
                          validate={(value) => {
                            if (!value) {
                              return "must not be empty"
                            }

                            if (tokenNames.includes(value)) {
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
                                placeholder="Client name"
                                aria-label="client name"
                                className="border-gray-300 placeholder-gray-500 appearance-none rounded-none relative block w-full px-3 py-2 border text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
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
                      onClick={() => setShowCreateToken(false)}
                    >
                      Cancel
                    </button>
                  </span>
                </div>
              </form>
            )}
          </Form>
        </Modal>

        <span className="text-xl  text-gray-900 space-x-2 flex items-center">
          <Link href="/dashboard">
            <a>
              <h1 className="font-semibold hover:text-gray-700">Projects</h1>
            </a>
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="inline w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>

          <span>{project.slug}</span>
        </span>

        <h2 className="text-md font-semibold text-gray-900 leading-7">Clients</h2>

        <CardList
          emptyText="Add a client using the button below."
          items={tokenNames.map((token) => ({
            title: token,
            href: `/projects/${project.slug}/clients/${token}`,
          }))}
        />

        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center float-right"
          onClick={() => setShowCreateToken(true)}
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
          <span>Add Client</span>
        </button>
      </div>

      <div className="mt-24">
        <h2 className="text-md font-semibold text-gray-900 leading-7">Actions</h2>

        <ul>
          <li>
            <Modal show={showDeleteProject}>
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                      Delete Project
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm leading-5 text-gray-500">
                        Are you sure you want to delete this project? This project's clients will
                        lose Quirrel access immediately. This action cannot be undone.
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
                      await deleteProject({ slug: project.slug })
                      Router.push("/dashboard")
                    }}
                  >
                    Delete
                  </button>
                </span>
                <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                    onClick={() => setShowDeleteProject(false)}
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
              onClick={() => setShowDeleteProject(true)}
              onKeyDown={() => setShowDeleteProject(true)}
            >
              Delete Project
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

SpecificProject.getLayout = (page) => <Layout>{page}</Layout>

export default SpecificProject
