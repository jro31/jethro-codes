import { getArticleBySlug, getArticles } from '../../lib/api';
import markdownToHtml from '../../lib/markdownToHtml';

import { templatesContainingFolder } from '.';
import Article from '../../components/layout/main-content/article';

const Template = ({ template }) => {
  return <Article article={template} />;
};

export default Template;

export const getStaticProps = async ({ params }) => {
  const template = getArticleBySlug(
    params.slug,
    ['title', 'description', 'lastUpdated', 'slug', 'content', 'coverImage', 'tags'],
    templatesContainingFolder
  );
  const content = await markdownToHtml(template.content || '');

  return {
    props: {
      template: {
        ...template,
        content,
        type: 'Template',
        subtitle: 'Project Template',
      },
    },
  };
};

export const getStaticPaths = () => {
  const templates = getArticles(['slug'], templatesContainingFolder);

  return {
    paths: templates.map(template => {
      return {
        params: {
          slug: template.slug,
        },
      };
    }),
    fallback: 'blocking',
  };
};
