import { Link, BlitzPage } from "blitz"
import Layout from "app/layouts/Layout"
import { Anchor } from "grommet"

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <Link href="/signup">
          <Anchor>Sign Up</Anchor>
        </Link>
      </main>
    </div>
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
