import { getArticles } from '../lib/api';
import HorizontalCard from '../components/ui/HorizontalCard';
import HorizontalCardsContainer from '../components/ui/HorizontalCardsContainer';
import SectionHome from '../components/layout/main-content/section-home';
import { articleSections } from '../hooks/useSectionDetails';
import useHeroImage from '../hooks/useHeroImage';

const Section = ({ allArticles }) => {
  return (
    <SectionHome heroImage={useHeroImage(allArticles)}>
      <HorizontalCardsContainer>
        {allArticles.map(article => (
          <HorizontalCard key={`${article.title}-card`} cardDetails={article} />
        ))}
      </HorizontalCardsContainer>
    </SectionHome>
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
