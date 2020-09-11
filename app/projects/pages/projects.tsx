import { BlitzPage, useQuery, Link, Router } from "blitz"
import getProjectSlugs from "app/queries/getProjectSlugs"
import createProject from "app/mutations/createProject"
import Layout from "app/layouts/Layout"
import { List, Box, Button, Text, Heading } from "grommet"
import { useEffect } from "react"
import { Add } from "grommet-icons"
import { isValidSlug } from "../slug"

const Projects: BlitzPage = () => {
  const [projectSlugs, projectSlugsMeta] = useQuery(getProjectSlugs, {})

  useEffect(() => {
    projectSlugs.forEach((slug) => {
      Router.prefetch("/projects/[slug]", `/projects/${slug}`)
    })
  }, [projectSlugs])

  return (
    <Box>
      <Heading>Projects</Heading>

      <List
        data={projectSlugs}
        onClickItem={(event) => {
          const slug = event.item
          Router.push("/projects/[slug]", `/projects/${slug}`)
        }}
      />

      <Button
        hoverIndicator="light-1"
        alignSelf="end"
        onClick={async () => {
          let slug = window.prompt(
            "Enter a slug for a new project. You're allowed to use alphanumerics and dashes. Don't use an existing one.",
            "my-awesome-project"
          )

          function isValid(slug: string | null) {
            return !!slug && isValidSlug(slug) && !projectSlugs.includes(slug)
          }

          while (!isValid(slug)) {
            if (!slug) {
              return
            }

            if (!isValidSlug(slug)) {
              slug = window.prompt(
                "You're allowed to use alphanumerics and dashes. Try a again.",
                slug!
              )
            }

            if (projectSlugs.includes(slug!)) {
              slug = window.prompt("Slug already used. Try another one.", slug!)
            }
          }

          await createProject(slug!)
          await projectSlugsMeta.refetch()
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

Projects.getLayout = (page) => <Layout>{page}</Layout>

export default Projects
