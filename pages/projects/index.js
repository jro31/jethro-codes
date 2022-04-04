import { getArticles } from '../../lib/api';
import Card from '../../components/ui/Card';

export const projectsContainingFolder = 'projects';

const Projects = ({ allProjects }) => {
  console.log(allProjects);

  return (
    <div className='flex flex-col gap-4'>
      {allProjects.map(project => (
        <Card
          key={`${project}-card`}
          cardDetails={project}
          containingFolder={projectsContainingFolder}
        />
      ))}
    </div>
  );
};

export default Projects;

export const getStaticProps = async () => {
  const allProjects = getArticles(
    ['title', 'description', 'slug', 'coverImage'],
    projectsContainingFolder
  ); // NICETOHAVE - Is there a way to generate the containing folder ('projects') programatically?

  return {
    props: { allProjects },
  };
};
