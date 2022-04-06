import { getArticles } from '../../lib/api';
import Card from '../../components/ui/Card';
import CardsContainer from '../../components/ui/CardsContainer';
import SectionHome from '../../components/layout/main-content/section-home';

export const templatesContainingFolder = 'templates';

const Templates = ({ allTemplates }) => {
  return (
    <SectionHome>
      <CardsContainer>
        {allTemplates.map(template => (
          <Card
            key={`${template}-card`}
            cardDetails={template}
            containingFolder={templatesContainingFolder}
          />
        ))}
      </CardsContainer>
    </SectionHome>
  );
};

export default Templates;

export const getStaticProps = async () => {
  const allTemplates = getArticles(
    ['title', 'description', 'slug', 'coverImage', 'tags'],
    templatesContainingFolder
  );

  return {
    props: { allTemplates },
  };
};
