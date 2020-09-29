import Layout from "app/layouts/Layout"
import { BlitzPage } from "blitz"

const termlyIFrame = `
<div name="termly-embed" data-id="c2eb45b1-d259-4c01-b1c3-f1c2e112c13d" data-type="iframe"></div>
<script type="text/javascript">(function(d, s, id) {
  var js, tjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://app.termly.io/embed-policy.min.js";
  tjs.parentNode.insertBefore(js, tjs);
}(document, 'script', 'termly-jssdk'));</script>
`

const TermsPage: BlitzPage = () => {
  return <div dangerouslySetInnerHTML={{ __html: termlyIFrame }}></div>
}

TermsPage.getLayout = (page) => <Layout>{page}</Layout>

export default TermsPage
