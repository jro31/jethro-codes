// TODO - Add sitemap to Google search console

import Layout from '../components/layout';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
