// ESSENTIAL - Update favicon
// TODO - Add sitemap to Google search console
// ESSENTIAL - Update readme

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
