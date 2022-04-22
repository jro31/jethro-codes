// TODO - Update favicon
// TODO - Update navbar logo
// TODO - Add sitemap to Google search console
// TODO - Update readme

import { Provider } from 'react-redux';

import store from '../store';
import Layout from '../components/layout';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
};

export default MyApp;
