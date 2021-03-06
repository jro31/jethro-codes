// NICETOHAVE - Add social media links to share this article
// Either an icon at the top of the page that opens a modal/dropdown, or a section at the bottom of the article.
// (or both)

import Head from 'next/head';
import { useRouter } from 'next/router';

import ArticleBody from './ArticleBody';
import ArticleHeader from './ArticleHeader';
import useTagsArray from '../../../../hooks/useTagsArray';
import { baseUrl, stockImagePath } from '../..';

const ArticleContainer = ({ article }) => {
  const router = useRouter();

  const pageTitle = `${article.title}${article.subtitle && ` | ${article.subtitle}`}`;
  const pageUrl = `${baseUrl}${router.asPath}`;
  const socialMediaImagePath = `${baseUrl}${
    article.coverImage ? article.coverImage : stockImagePath
  }`;

  return (
    <article>
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content={article.description} />
        <meta name='keywords' content={article.tags || ''} />

        {/* Facebook */}
        <meta property='og:title' content={pageTitle} />
        <meta property='og:description' content={article.description} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={pageUrl} />
        <meta property='og:image' content={socialMediaImagePath} />

        {/* Twitter */}
        <meta name='twitter:title' content={pageTitle} />
        <meta name='twitter:site' content='@jethro_williams' />
        <meta name='twitter:description' content={article.description} />
        <meta name='twitter:image' content={socialMediaImagePath} />
        <meta name='twitter:card' content='summary_large_image' />

        <link href='https://unpkg.com/prismjs@0.0.1/themes/prism-okaidia.css' rel='stylesheet' />
      </Head>
      <ArticleHeader
        title={article.title}
        description={article.description}
        published={article.published}
        coverImage={article.coverImage}
        tagsArray={useTagsArray(article.tags)}
        type={article.type || ''}
        minsToRead={article.minsToRead}
      />
      <ArticleBody content={article.content} />
    </article>
  );
};

export default ArticleContainer;
