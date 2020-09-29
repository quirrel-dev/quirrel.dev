import Layout from "app/layouts/Layout"
import { BlitzPage } from "blitz"

const termlyIFrame = `
<div name="termly-embed" data-id="7d662f10-22c6-4c6d-b93f-621411239ed6" data-type="iframe"></div>
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
