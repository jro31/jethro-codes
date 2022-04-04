import { getArticleBySlug, getArticles } from '../../lib/api';
import Head from 'next/head';
import markdownToHtml from '../../lib/markdownToHtml';

import { projectsContainingFolder } from '.';

const Project = ({ project }) => {
  return (
    <article>
      <Head>
        {/* TODO - Add meta tags */}
        <title>{project.title} | Anatomy of a Project</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: project.content }} />
    </article>
  );
};

export default Project;

export const getStaticProps = async ({ params }) => {
  const project = getArticleBySlug(
    params.slug,
    ['title', 'date', 'slug', 'content', 'ogImage', 'coverImage'],
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
