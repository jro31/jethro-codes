import { getArticles } from '../../lib/api';
import Card from '../../components/ui/Card';
import CardsContainer from '../../components/ui/CardsContainer';
import SectionHome from '../../components/layout/main-content/section-home';

export const projectsContainingFolder = 'projects';

const Projects = ({ allProjects }) => {
  return (
    <SectionHome>
      <CardsContainer>
        {allProjects.map(project => (
          <Card
            key={`${project}-card`}
            cardDetails={project}
            containingFolder={projectsContainingFolder}
          />
        ))}
      </CardsContainer>
    </SectionHome>
  );
};

export default Projects;

export const getStaticProps = async () => {
  const allProjects = getArticles(
    ['title', 'description', 'slug', 'coverImage', 'tags'],
    projectsContainingFolder
  ); // NICETOHAVE - Is there a way to generate the containing folder ('projects') programatically?

  return {
    props: { allProjects },
  };
};
