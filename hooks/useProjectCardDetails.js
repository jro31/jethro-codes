import { blocksFalling, mealsOfChange, wheresJethro } from '../pages/projects';

const useProjectCardDetails = () => {
  const projectCardDetails = projectCard => {
    switch (projectCard) {
      case blocksFalling:
        return {
          title: 'Blocks Falling',
          description: 'This is a really cool description', // TODO - Update this
          route: '',
          picture: 'images/blocks-falling.png',
        };
      case mealsOfChange:
        return {
          title: 'Meals of Change',
          description: 'This is a really cool description', // TODO - Update this
          route: '/projects/mealsOfChange',
          picture: '/images/meals-of-change.png',
        };
      case wheresJethro:
        return {
          title: "Where's Jethro",
          description: 'This is a really cool description', // TODO - Update this
          route: '',
          picture: 'images/wheres-jethro.png',
        };
      default:
        throw new Error(
          `Unrecognised project card '${projectCard}' passed to useProjectCardDetails`
        );
    }
  };

  return projectCardDetails;
};

export default useProjectCardDetails;
