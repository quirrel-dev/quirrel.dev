import { ReactNode, Suspense } from "react"
import { Head, Link } from "blitz"
import { Header, Anchor } from "grommet"
import { LoginState } from "app/components/LoginState"

interface LayoutProps {
  title?: string
  children: ReactNode
  hideLogin?: boolean
}

const Layout = ({ title, children, hideLogin }: LayoutProps) => (
  <>
    <Head>
      <title>{title || "Quirrel"}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header background="brand" pad="small">
      <Link href="/">
        <Anchor>Quirrel</Anchor>
      </Link>

      {!hideLogin && (
        <Suspense fallback={null}>
          <LoginState />
        </Suspense>
      )}
    </Header>

    {children}
  </>
)

export default Layout
