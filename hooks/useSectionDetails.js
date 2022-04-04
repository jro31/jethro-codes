import { HomeIcon, PaperClipIcon } from '@heroicons/react/outline';
import { home, projects } from '../components/layout';

const useSectionDetails = () => {
  const sectionDetails = sectionName => {
    switch (sectionName) {
      case home:
        return {
          title: '',
          linkText: 'Home',
          route: '/',
          icon: HomeIcon,
        };
      case projects:
        return {
          title: 'Projects',
          linkText: 'Projects',
          route: '/projects',
          icon: PaperClipIcon,
        };
      default:
        return {};
      // throw new Error(`Unrecognised section name '${sectionName}' passed to useSectionDetails`);
    }
  };

  return sectionDetails;
};

export default useSectionDetails;
