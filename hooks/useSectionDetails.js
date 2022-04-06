import { HomeIcon, PaperClipIcon } from '@heroicons/react/outline';

const home = 'home';
const projects = 'projects';

export const sectionOrder = [home, projects];

const useSectionDetails = () => {
  const sectionDetails = sectionName => {
    switch (sectionName) {
      case home:
        return {
          title: 'jethro.codes',
          description: 'My home for everything code.',
          linkText: 'Home',
          route: '/',
          icon: HomeIcon,
        };
      case projects:
        return {
          title: 'Projects',
          description: 'Going in depth on my latest personal projects.',
          linkText: 'Projects',
          route: '/projects',
          icon: PaperClipIcon,
        };
      default:
        throw new Error(`Unrecognised section name '${sectionName}' passed to useSectionDetails`);
    }
  };

  return sectionDetails;
};

export default useSectionDetails;
