import { getArticles } from '../../lib/api';
import Card from '../../components/ui/Card';
import CardsContainer from '../../components/ui/CardsContainer';

export const projectsContainingFolder = 'projects';

const Projects = ({ allProjects }) => {
  return (
    <CardsContainer>
      {allProjects.map(project => (
        <Card
          key={`${project}-card`}
          cardDetails={project}
          containingFolder={projectsContainingFolder}
        />
      ))}
    </CardsContainer>
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
