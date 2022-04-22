// NICETOHAVE - Add social media links to share this article

import Head from 'next/head';

import ArticleBody from './ArticleBody';
import ArticleHeader from './ArticleHeader';
import useTagsArray from '../../../../hooks/useTagsArray';

const ArticleContainer = ({ article }) => {
  return (
    <article>
      <Head>
        {/* ESSENTIAL - Add meta tags; use 'tags' as keywords */}
        <title>
          {article.title}
          {article.subtitle && ` | ${article.subtitle}`}
        </title>
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
