// TODO - Add social media links to share this article
// TODO - Add 'First commit' date, and optionally add it to the article header (will only be used on projects/templates/packages)

import Head from 'next/head';
import ArticleBody from './ArticleBody';
import ArticleHeader from './ArticleHeader';
import useReadingMinutes from '../../../../hooks/useReadingMinutes';

const ArticleContainer = ({ article }) => {
  const readingMinutes = useReadingMinutes();

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
        published={article.published}
        lastUpdated={article.lastUpdated}
        // coverImage={article.coverImage}
        tagsArray={article.tags ? article.tags.split(', ') : []}
        type={article.type || ''}
        timeToRead={readingMinutes(article.content)}
      />
      <ArticleBody content={article.content} />
    </article>
  );
};

export default ArticleContainer;
