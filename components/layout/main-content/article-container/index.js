// NICETOHAVE - Add social media links to share this article

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
        {/* TODO - Once the app is online, run these tags through Twitter/Facebook tools, and check cover image and stock image paths work */}
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
