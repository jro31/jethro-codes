import fs from 'fs';

import { getArticles } from '../lib/api';

const Sitemap = () => {};

export default Sitemap;

export const getServerSideProps = ({ req, res }) => {
  // console.log('❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥');
  // console.log(req.headers.host);
  // console.log('😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁😁');
  // console.log(res);
  // console.log(process.env.NODE_ENV);
  // console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀');

  const baseUrl = `${process.env.NODE_ENV === 'production' ? 'https://' : 'http://'}${
    req.headers.host
  }`;

  // console.log(baseUrl);

  console.log(fs.readdirSync('pages'));

  const staticPages = fs
    .readdirSync('pages')
    .filter(staticPage => {
      return !['_app.js', '_document.js', 'sitemap.xml.js'].includes(staticPage);
    })
    .map(staticPagePath => {
      return `${baseUrl}/${staticPagePath}`;
    });

  // TODO - Don't forget about the section pages, e.g base-url/projects

  const allArticles = getArticles(['slug', 'section']);
  const allArticlePaths = allArticles.map(
    article => `${article.section && `${article.section}/`}${article.slug}`
  );

  // `/${section && `${section}/`}${slug}`

  // ${staticPages
  //   .map(url => {
  //     return `
  //       <url>
  //         <loc>${url}</loc>
  //       </url>
  //     `;
  //   })
  //   .join('')}

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allArticlePaths.map(path => `<url><loc>${baseUrl}/${path}</loc></url>`).join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};
