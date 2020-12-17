import { Document, Html, DocumentHead, Main, BlitzScript /*DocumentContext*/ } from "blitz"

class MyDocument extends Document {
  // Only uncomment if you need to customize this behaviour
  // static async getInitialProps(ctx: DocumentContext) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return {...initialProps}
  // }

  render() {
    return (
      <Html lang="en">
        <DocumentHead>
          <script
            async
            defer
            data-domain="quirrel.dev"
            src="https://plausible.io/js/plausible.js"
          />
        </DocumentHead>
        <body>
          <Main />
          <BlitzScript />

          <script async data-id="122499" src="https://betteruptime.com/widgets/announcement.js" />
        </body>
      </Html>
    )
  }
}

export default MyDocument
