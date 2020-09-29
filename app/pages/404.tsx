import Layout from "app/layouts/Layout"
import { BlitzPage } from "blitz"

const Page404: BlitzPage = () => {
  return (
    <h2 className="text-center text-xl font-light text-gray-700">This page could not be found.</h2>
  )
}

Page404.getLayout = (page) => <Layout title="404: Not found">{page}</Layout>

export default Page404
