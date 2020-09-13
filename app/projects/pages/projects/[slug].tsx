import { useParam, useQuery, BlitzPage, Router } from "blitz"
import getProject from "app/projects/queries/getProject"
import addToken from "app/projects/mutations/addToken"
import deleteToken from "app/projects/mutations/deleteToken"
import Layout from "app/layouts/Layout"
import { Button, Box, Text, Heading, Accordion, AccordionPanel, DataChart } from "grommet"
import { Add, Trash } from "grommet-icons"
import deleteProject from "app/projects/mutations/deleteProject"
import { Suspense } from "react"
import getUsageRecords from "app/projects/queries/getUsageRecords"

function UsageReport({ projectSlug, tokenName }: { projectSlug: string; tokenName?: string }) {
  const [usageReports] = useQuery(getUsageRecords, { projectSlug, tokenName })

  return (
    <Box align="center">
      <Text>The data below is just a dummy.</Text>
      <DataChart
        guide
        data={usageReports}
        series={["date", "invocations"]}
        chart={[
          {
            property: "invocations",
            type: "line",
            thickness: "xsmall",
          },
          {
            property: "invocations",
            type: "point",
            thickness: "small",
            point: "circle",
          },
        ]}
        axis={{
          x: { property: "date", granularity: "fine" },
          y: { property: "invocations", granularity: "medium" },
        }}
        detail
      />
    </Box>
  )
}

function TokenInfo({
  projectSlug,
  tokenName,
  onDelete,
}: {
  projectSlug: string
  tokenName: string
  onDelete: () => void
}) {
  return (
    <Box>
      <Suspense fallback="Loading ...">
        <UsageReport projectSlug={projectSlug} tokenName={tokenName} />
      </Suspense>
      <Button onClick={onDelete} hoverIndicator="light-1" alignSelf="end">
        <Box pad="small" direction="row" align="center" gap="small">
          <Trash />
          <Text>Delete Token</Text>
        </Box>
      </Button>
    </Box>
  )
}

const SpecificProject: BlitzPage = () => {
  const slug = useParam("slug") as string

  const [project, projectMeta] = useQuery(getProject, { slug })
  if (!project) {
    return <p>Not Found.</p>
  }

  const tokenNames = project.tokens.map((t) => t.name) ?? []

  return (
    <div>
      <Heading level={1}>{project.slug}</Heading>

      <Suspense fallback="Loading ...">
        <UsageReport projectSlug={slug} />
      </Suspense>

      <Heading level={2}>Tokens</Heading>

      <Accordion>
        {project.tokens.map((token) => (
          <AccordionPanel label={<Heading level={3}>{token.name}</Heading>}>
            <Suspense fallback="Loading...">
              <TokenInfo
                projectSlug={slug}
                tokenName={token.name}
                onDelete={async () => {
                  const sure = window.confirm("You sure?")

                  if (!sure) {
                    return
                  }

                  const reallySure = window.confirm(
                    "This can potentially cause catastrophic consequences. You know what you're doing?"
                  )

                  if (reallySure) {
                    await deleteToken({ projectSlug: slug, name: token.name })
                    await projectMeta.refetch()
                  }
                }}
              />
            </Suspense>
          </AccordionPanel>
        ))}
      </Accordion>

      <Button
        hoverIndicator="light-1"
        alignSelf="end"
        onClick={async () => {
          let name = window.prompt("Name?")
          if (!name) {
            return
          }

          while (tokenNames.includes(name!)) {
            name = window.prompt("Name's already used. Try again:", name!)

            if (!name) {
              return
            }
          }

          const token = await addToken({ projectSlug: project.slug, name: name! })
          await projectMeta.refetch()
          window.alert(token)
        }}
      >
        <Box pad="small" direction="row" align="center" gap="small">
          <Add />
          <Text>Add Token</Text>
        </Box>
      </Button>

      <Button
        onClick={async () => {
          const sure = window.confirm("You sure?")

          if (!sure) {
            return
          }

          const reallySure = window.confirm(
            "This can potentially cause catastrophic consequences. You know what you're doing?"
          )

          if (reallySure) {
            Router.prefetch("/projects")
            await deleteProject({ slug })
            Router.push("/projects")
          }
        }}
        hoverIndicator="light-1"
      >
        <Box pad="small" direction="row" align="center" gap="small">
          <Trash />
          <Text>Delete Project</Text>
        </Box>
      </Button>
    </div>
  )
}

SpecificProject.getLayout = (page) => <Layout>{page}</Layout>

export default SpecificProject
