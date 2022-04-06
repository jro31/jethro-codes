import { useRouter } from 'next/router';

const useIsSectionHome = () => {
  const router = useRouter();

  const isSectionHome = () => router.pathname.split('/').length - 1 <= 1;

  return isSectionHome;
};

export default useIsSectionHome;
