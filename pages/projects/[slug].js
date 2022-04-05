import { getArticleBySlug, getArticles } from '../../lib/api';
import Head from 'next/head';
import markdownToHtml from '../../lib/markdownToHtml';

import { projectsContainingFolder } from '.';
import ArticleHeader from '../../components/layout/main-content/articles/ArticleHeader';
import ArticleBody from '../../components/layout/main-content/articles/ArticleBody';

const Project = ({ project }) => {
  return (
    <article>
      <Head>
        {/* TODO - Add meta tags; use tags as keywords */}
        <title>{project.title} | Anatomy of a Project</title>
      </Head>
      <ArticleHeader
        title={project.title}
        description={project.description}
        lastUpdated={project.lastUpdated}
        coverImage={project.coverImage}
        tagsArray={project.tags.split(', ')}
      />
      <ArticleBody content={project.content} />
    </article>
  );
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
