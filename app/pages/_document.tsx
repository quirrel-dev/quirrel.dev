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
          <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
          <script type="text/javascript">{`Paddle.Setup({ vendor: 121877 });`}</script>

          <script
            async
            defer
            data-website-id="018ba280-dae0-40b3-9af7-5d84b7001bad"
            src="https://umami.quirrel.dev/umami.js"
          />
        </DocumentHead>
        <body>
          <Main />
          <BlitzScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
