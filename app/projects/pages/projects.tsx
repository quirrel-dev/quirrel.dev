import { BlitzPage, useQuery, Router } from "blitz"
import getProjectSlugs from "app/projects/queries/getProjectSlugs"
import createProject from "app/projects/mutations/createProject"
import { List, Box, Button, Text, Heading } from "grommet"
import { useEffect, useState } from "react"
import { Add } from "grommet-icons"
import { isValidSlug } from "../slug"
import { SubscriberOnlyLayout } from "app/layouts/SubscriberOnlyLayout"
import { Modal } from "app/components/Modal"
import { Form, Field } from "react-final-form"

const Projects: BlitzPage = () => {
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [projectSlugs, projectSlugsMeta] = useQuery(getProjectSlugs, {})

  useEffect(() => {
    projectSlugs.forEach((slug) => {
      Router.prefetch("/projects/[slug]", `/projects/${slug}`)
    })
  }, [projectSlugs])

  return (
    <Box>
      <Modal show={showCreateProject} onRequestClose={() => setShowCreateProject(false)}>
        <Form
          onSubmit={async (values) => {
            const { name } = values

            await createProject(name)
            await projectSlugsMeta.refetch()
            setShowCreateProject(false)
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
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
                              placeholder="Project name"
                              aria-label="project name"
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
      <Heading>Projects</Heading>

      <List
        data={projectSlugs}
        onClickItem={({ item: slug }) => {
          Router.push("/projects/[slug]", `/projects/${slug}`)
        }}
      />

      <Button
        hoverIndicator="light-1"
        alignSelf="end"
        onClick={async () => {
          setShowCreateProject(true)
          return
        }}
      >
        <Box pad="small" direction="row" align="center" gap="small">
          <Add />
          <Text>Create Project</Text>
        </Box>
      </Button>
    </Box>
  )
}

Projects.getLayout = (page) => <SubscriberOnlyLayout>{page}</SubscriberOnlyLayout>

export default Projects
