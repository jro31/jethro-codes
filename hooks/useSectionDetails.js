import { HomeIcon, PaperClipIcon, TemplateIcon } from '@heroicons/react/outline'; // TODO - Save these icons locally

const home = 'home';
const projects = 'projects';
const templates = 'templates';

export const sectionOrder = [home, projects, templates];
export const articleSections = [projects, templates];

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
      case templates:
        return {
          title: 'Templates',
          description: 'Project templates to save time starting from scratch.',
          linkText: 'Templates',
          route: '/templates',
          icon: TemplateIcon,
        };
      default:
        throw new Error(`Unrecognised section name '${sectionName}' passed to useSectionDetails`);
    }
  };

  return sectionDetails;
};

export default useSectionDetails;
