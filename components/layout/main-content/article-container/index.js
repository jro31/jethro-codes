// TODO - Add social media links to share this article

import Head from 'next/head';
import ArticleBody from './ArticleBody';
import ArticleHeader from './ArticleHeader';

const ArticleContainer = ({ article }) => {
  return (
    <article>
      <Head>
        {/* TODO - Add meta tags; use 'tags' as keywords */}
        <title>
          {article.title}
          {article.subtitle && ` | ${article.subtitle}`}
        </title>
      </Head>
      <ArticleHeader
        title={article.title}
        description={article.description}
        lastUpdated={article.lastUpdated}
        // coverImage={article.coverImage}
        tagsArray={article.tags.split(', ')}
        type={article.type}
      />
      <ArticleBody content={article.content} />
    </article>
  );
};

export default ArticleContainer;
