import useProjectCardDetails from '../../hooks/useProjectCardDetails';
import Card from '../../components/ui/Card';

export const blocksFalling = 'blocks-falling';
export const mealsOfChange = 'meals-of-change';
export const wheresJethro = 'wheres-jethro';

const projectCardOrder = [mealsOfChange, wheresJethro, blocksFalling];

const Projects = () => {
  const projectCardDetails = useProjectCardDetails();

  return (
    <div className='flex flex-col gap-4'>
      {projectCardOrder.map(projectCard => (
        <Card key={`${projectCard}-card`} cardDetails={projectCardDetails(projectCard)} />
      ))}
    </div>
  );
};

export default Projects;
