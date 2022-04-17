import { getArticleBySlug } from '../../lib/api';
import markdownToHtml from '../../lib/markdownToHtml';
import ArticleContainer from '../../components/layout/main-content/article-container';

const MyStory = ({ article }) => {
  return <ArticleContainer article={article} />;
};

export default MyStory;

export const getStaticProps = async () => {
  const article = getArticleBySlug('my-story', [
    'title',
    'description',
    'published',
    'lastUpdated',
    'content',
    'minsToRead',
  ]);
  const content = await markdownToHtml(article.content || '');

  return {
    props: {
      article: {
        ...article,
        content,
        subtitle: 'Why I became a software engineer',
      },
    },
  };
};
