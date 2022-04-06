import { getArticles } from '../lib/api';
import Card from '../components/ui/Card';
import CardsContainer from '../components/ui/CardsContainer';
import SectionHome from '../components/layout/main-content/section-home';
import { articleSections } from '../hooks/useSectionDetails';

const Section = ({ allArticles }) => {
  return (
    <SectionHome>
      <CardsContainer>
        {allArticles.map(article => (
          <Card key={`${article}-card`} cardDetails={article} containingFolder={article.section} />
        ))}
      </CardsContainer>
    </SectionHome>
  );
};

export default Section;

export const getStaticProps = async ({ params }) => {
  const allArticles = getArticles(
    ['title', 'description', 'slug', 'coverImage', 'tags', 'section'],
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
