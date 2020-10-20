import { useParam, useQuery, BlitzPage, Router, Link, useMutation } from "blitz"
import getProject from "app/projects/queries/getProject"
import deleteTokenMutation from "app/projects/mutations/deleteToken"
import Layout from "app/layouts/Layout"
import { Suspense, useState } from "react"
import { Modal } from "app/components/Modal"
import { UsageGraph } from "app/projects/components/UsageGraph"

function useCreatedToken(slug: string, name: string) {
  if (typeof window !== "undefined") {
    const tokenToShow = sessionStorage.getItem("created-token-" + slug + "-" + name)
    return [tokenToShow, () => sessionStorage.removeItem("created-token-" + slug + "-" + name)]
  }

  return [null, () => {}]
}

const SpecificEnvironment: BlitzPage = () => {
  const slug = useParam("slug", "string")!
  const environment = useParam("environment", "string")!
  const [tokenToShow] = useCreatedToken(slug, environment)

  const [deleteToken] = useMutation(deleteTokenMutation)
  const [showDeleteEnv, setShowDeleteEnv] = useState(false)

  const [project] = useQuery(getProject, { slug })
  if (!project) {
    return <p>Not Found.</p>
  }

  return (
    <div className="mt-4 max-w-screen-md lg:mx-auto">
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

        <Link href={`/projects/${slug}`}>
          <a>
            <h1 className="font-semibold hover:text-gray-700">{slug}</h1>
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

        <span>{environment}</span>
      </span>

      {tokenToShow && (
        <div className="rounded border-green-500 border bg-green-100 p-4 mt-4 text-center">
          This is your token. It'll only be displayed in this session, so take note of it:
          <br />
          <div className="inline-block bg-white w-auto px-4 py-2 rounded mt-4 select-all">
            {tokenToShow}
          </div>
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-md font-semibold text-gray-900 leading-7">Usage</h2>

        <Suspense fallback="Loading ...">
          <UsageGraph projectSlug={slug} tokenName={environment} />
        </Suspense>
      </div>

      <div className="mt-4">
        <h2 className="text-md font-semibold text-gray-900 leading-7">Actions</h2>

        <ul>
          <li>
            <Modal show={showDeleteEnv}>
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
                      Delete Environment
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm leading-5 text-gray-500">
                        Are you sure you want to delete this environment? It will lose access
                        immediately. This action cannot be undone.
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
                      await deleteToken({ projectSlug: slug, name: environment })
                      Router.push(`/projects/${slug}`)
                    }}
                  >
                    Delete
                  </button>
                </span>
                <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                    onClick={() => setShowDeleteEnv(false)}
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
              onClick={() => setShowDeleteEnv(true)}
              onKeyDown={() => setShowDeleteEnv(true)}
            >
              Delete Environment
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

SpecificEnvironment.getLayout = (page) => <Layout>{page}</Layout>

export default SpecificEnvironment
