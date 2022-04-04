import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { getArticleBySlug, getArticles } from '../../lib/api';
import Head from 'next/head';
import markdownToHtml from '../../lib/markdownToHtml';

import { projectsContainingFolder } from '.';

const Project = ({ project, morePosts, preview }) => {
  const router = useRouter();
  if (!router.isFallback && !project?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <>
      {router.isFallback ? (
        <div>Loading…</div>
      ) : (
        <>
          <article className='mb-32'>
            <Head>
              {/* TODO - Add meta tags */}
              <title>{project.title} | Anatomy of a Project</title>
            </Head>
            <div className='max-w-2xl mx-auto'>
              <div dangerouslySetInnerHTML={{ __html: project.content }} />
            </div>
          </article>
        </>
      )}
    </>
  );
};

export default Project;

export async function getStaticProps({ params }) {
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
}

export async function getStaticPaths() {
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
}
