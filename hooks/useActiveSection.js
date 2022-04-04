import { useRouter } from 'next/router';

import useSectionDetails from './useSectionDetails';
import { sectionOrder } from '../components/layout';

const useActiveSection = () => {
  const router = useRouter();
  const sectionDetails = useSectionDetails();

  const activeSection = () =>
    sectionOrder.find(sectionName => sectionDetails(sectionName).route === router.pathname);

  return activeSection;
};

export default useActiveSection;
