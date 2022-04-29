import { allContainingFolders, getArticles } from '../lib/api';

const Sitemap = () => {};

export default Sitemap;

export const getServerSideProps = ({ req, res }) => {
  const baseUrl = `${process.env.NODE_ENV === 'production' ? 'https://' : 'http://'}${
    req.headers.host
  }`;

  const allArticles = getArticles(['slug', 'section']);
  const allArticlePaths = allArticles.map(
    article => `${article.section && `${article.section}/`}${article.slug}`
  );

  const allPaths = [...allContainingFolders(), 'contact', ...allArticlePaths];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths.map(path => `<url><loc>${baseUrl}/${path}</loc></url>`).join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};
