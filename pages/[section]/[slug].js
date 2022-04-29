// TODO - Add 'Blocks falling' article
// TODO - Add 'Where's Jethro' article

import { getArticleBySlug, getArticles } from '../../lib/api';
import markdownToHtml from '../../lib/markdownToHtml';

import ArticleContainer from '../../components/layout/main-content/article-container';

import { articleSections } from '../../hooks/useSectionDetails';

const Article = ({ article }) => {
  return <ArticleContainer article={article} />;
};

export default Article;

export const getStaticProps = async ({ params }) => {
  const article = getArticleBySlug(
    params.slug,
    ['title', 'description', 'published', 'content', 'coverImage', 'tags', 'minsToRead'],
    params.section
  );
  const content = await markdownToHtml(article.content || '');

  const subtitle = section => {
    switch (section) {
      case 'projects':
        return 'Anatomy of a Project';
      case 'templates':
        return 'Project Template';
      default:
        return '';
    }
  };

  return {
    props: {
      article: {
        ...article,
        content,
        type: params.section.slice(0, -1),
        subtitle: subtitle(params.section),
      },
    },
  };
};

export const getStaticPaths = () => {
  const articles = [];

  articleSections.map(section => {
    articles.push(getArticles(['slug', 'section'], section));
  });

  return {
    paths: articles.flat().map(article => {
      return {
        params: {
          section: article.section,
          slug: article.slug,
        },
      };
    }),
    fallback: 'blocking',
  };
};
