// TODO - Possible future sections: Blog, Gems, Tutorials, Buy me a coffee, Components/Features/Hooks

import {
  ChatIcon,
  CubeIcon,
  HomeIcon,
  PaperClipIcon,
  TemplateIcon,
  TrendingUpIcon,
} from '@heroicons/react/outline';

const contact = 'contact';
const home = 'home';
const myStory = 'my-story';
export const packages = 'packages';
export const projects = 'projects';
export const templates = 'templates';

export const sectionOrder = [home, projects, templates, packages, myStory, contact];
export const articleSections = [packages, projects, templates];

const useSectionDetails = () => {
  const sectionDetails = sectionName => {
    switch (sectionName) {
      case contact:
        return {
          title: 'Contact',
          linkText: 'Contact',
          route: `/${contact}`,
          icon: ChatIcon,
        };
      case home:
        return {
          title: 'jethro.codes',
          description: 'My home for everything code',
          linkText: 'Home',
          route: '/',
          icon: HomeIcon,
        };
      case myStory:
        return {
          title: 'My Story',
          linkText: 'My Story',
          route: `/${myStory}`,
          icon: TrendingUpIcon,
        };
      case packages:
        return {
          title: 'Packages',
          description: 'npm packages',
          linkText: 'Packages',
          route: `/${packages}`,
          icon: CubeIcon,
        };
      case projects:
        return {
          title: 'Projects',
          description: 'Going in depth on my latest personal projects',
          linkText: 'Projects',
          route: `/${projects}`,
          icon: PaperClipIcon,
        };
      case templates:
        return {
          title: 'Templates',
          description: 'Project templates to save time starting from scratch',
          linkText: 'Templates',
          route: `/${templates}`,
          icon: TemplateIcon,
        };
      default:
        throw new Error(`Unrecognised section name '${sectionName}' passed to useSectionDetails`);
    }
  };

  return sectionDetails;
};

export default useSectionDetails;
