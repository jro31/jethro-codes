import { useRouter } from 'next/router';

import useSectionDetails from './useSectionDetails';

const useIsCurrentPage = () => {
  const router = useRouter();
  const sectionDetails = useSectionDetails();

  const isCurrentPage = sectionName => sectionDetails(sectionName).route === router.pathname;

  return isCurrentPage;
};

export default useIsCurrentPage;
