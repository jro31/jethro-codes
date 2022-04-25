import Head from 'next/head';

import SectionHome from '../components/layout/main-content/section-home';
import VerticalCard from '../components/ui/VerticalCard';
import VerticalCardsContainer from '../components/ui/VerticalCardsContainer';
import { getArticles } from '../lib/api';
import useHeroImage from '../hooks/useHeroImage';
import { baseUrl, stockImagePath } from '../components/layout';

const appTitle = 'jethro.codes';
const appDescription = "I'm Jethro. This is my home for everything code.";
const socialMediaImagePath = `${baseUrl}${stockImagePath}`;

const Home = ({ featureArticles }) => {
  return (
    <>
      <Head>
        <title>{appTitle}</title>
        <meta name='description' content={appDescription} />
        <meta
          name='keywords'
          content='Ruby on Rails API template, Next.js template, Ruby on Rails tutorial, Next.js tutorial'
        />

        {/* Facebook */}
        <meta property='og:title' content={appTitle} />
        <meta property='og:description' content={appDescription} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={baseUrl} />
        <meta property='og:image' content={socialMediaImagePath} />

        {/* Twitter */}
        <meta name='twitter:title' content={appTitle} />
        <meta name='twitter:site' content='@jethro_williams' />
        <meta name='twitter:description' content={appDescription} />
        <meta name='twitter:image' content={socialMediaImagePath} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>

      <SectionHome heroImage={useHeroImage(featureArticles)}>
        <VerticalCardsContainer title='Latest content'>
          {featureArticles.map(article => (
            <VerticalCard key={`${article.title}-card`} cardDetails={article} />
          ))}
        </VerticalCardsContainer>
      </SectionHome>
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const featureArticles = getArticles([
    'title',
    'description',
    'slug',
    'coverImage',
    'section',
    'published',
    'minsToRead',
  ]).slice(0, 6);

  return {
    props: { featureArticles },
  };
};
