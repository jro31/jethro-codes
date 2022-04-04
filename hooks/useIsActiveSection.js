import { useRouter } from 'next/router';

import useSectionDetails from './useSectionDetails';

const useIsActiveSection = () => {
  const router = useRouter();
  const sectionDetails = useSectionDetails();

  const isActiveSection = sectionName => sectionDetails(sectionName).route === router.pathname;

  return isActiveSection;
};

export default useIsActiveSection;
