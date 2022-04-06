import { useRouter } from 'next/router';

import useSectionDetails, { sectionOrder } from './useSectionDetails';

const useActiveSection = () => {
  const router = useRouter();
  const sectionDetails = useSectionDetails();

  const activeSection = () => {
    return sectionOrder.find(
      sectionName => sectionDetails(sectionName).route === `/${router.asPath.split('/')[1]}`
    );
  };

  return activeSection;
};

export default useActiveSection;
