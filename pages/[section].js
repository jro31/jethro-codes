import Head from 'next/head';
import { useRouter } from 'next/router';

import { getArticles } from '../lib/api';
import HorizontalCard from '../components/ui/HorizontalCard';
import HorizontalCardsContainer from '../components/ui/HorizontalCardsContainer';
import SectionHome from '../components/layout/main-content/section-home';
import { articleSections } from '../hooks/useSectionDetails';
import useHeroImage from '../hooks/useHeroImage';
import useActiveSection from '../hooks/useActiveSection';
import useSectionDetails from '../hooks/useSectionDetails';
import { baseUrl, stockImagePath } from '../components/layout';

const Section = ({ allArticles }) => {
  const router = useRouter();
  const activeSection = useActiveSection();
  const sectionDetails = useSectionDetails();

  const pageTitle = `${sectionDetails(activeSection()).title} | jethro.codes`;
  const pageDescription = sectionDetails(activeSection()).description;
  const socialMediaImagePath = `${baseUrl}${stockImagePath}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
        <meta name='keywords' content='' />

        {/* Facebook */}
        <meta property='og:title' content={pageTitle} />
        <meta property='og:description' content={pageDescription} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={`${baseUrl}${router.asPath}`} />
        <meta property='og:image' content={socialMediaImagePath} />

        {/* Twitter */}
        <meta name='twitter:title' content={pageTitle} />
        <meta name='twitter:site' content='@jethro_williams' />
        <meta name='twitter:description' content={pageDescription} />
        <meta name='twitter:image' content={socialMediaImagePath} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>
      <SectionHome heroImage={useHeroImage(allArticles)}>
        <HorizontalCardsContainer>
          {allArticles.map(article => (
            <HorizontalCard key={`${article.title}-card`} cardDetails={article} />
          ))}
        </HorizontalCardsContainer>
      </SectionHome>
    </>
  );
};

export default Section;

export const getStaticProps = async ({ params }) => {
  const allArticles = getArticles(
    ['title', 'description', 'slug', 'coverImage', 'section'],
    params.section
  );

  return {
    props: { allArticles },
  };
};

export const getStaticPaths = () => {
  return {
    paths: articleSections.map(section => {
      return {
        params: {
          section: section,
        },
      };
    }),
    fallback: 'blocking',
  };
};
