import { useRouter } from 'next/router';

import useSectionDetails, { sectionOrder } from './useSectionDetails';

const useActiveSection = () => {
  const router = useRouter();
  const sectionDetails = useSectionDetails();

  const activeSection = () =>
    sectionOrder.find(
      sectionName => sectionDetails(sectionName).route === `/${router.pathname.split('/')[1]}`
    );

  return activeSection;
};

export default useActiveSection;
