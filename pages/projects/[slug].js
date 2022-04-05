import { getArticleBySlug, getArticles } from '../../lib/api';
import markdownToHtml from '../../lib/markdownToHtml';

import { projectsContainingFolder } from '.';
import Article from '../../components/layout/main-content/article';

const Project = ({ project }) => {
  return <Article article={project} />;
};

export default Project;

export const getStaticProps = async ({ params }) => {
  const project = getArticleBySlug(
    params.slug,
    ['title', 'description', 'lastUpdated', 'slug', 'content', 'coverImage', 'tags'],
    projectsContainingFolder
  );
  const content = await markdownToHtml(project.content || '');

  return {
    props: {
      project: {
        ...project,
        content,
        subtitle: 'Anatomy of a Project',
      },
    },
  };
};

export const getStaticPaths = () => {
  const projects = getArticles(['slug'], projectsContainingFolder);

  return {
    paths: projects.map(project => {
      return {
        params: {
          slug: project.slug,
        },
      };
    }),
    fallback: 'blocking',
  };
};
