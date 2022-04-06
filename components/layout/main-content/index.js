import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const MainContent = props => {
  const mainRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const scrollToTop = () => (mainRef.current.scrollTop = 0);

    router.events.on('routeChangeComplete', scrollToTop);

    return () => {
      router.events.off('routeChangeComplete', scrollToTop);
    };
  }, [router.events]);

  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      <div className='flex-1 flex items-stretch overflow-hidden'>
        <main ref={mainRef} className='flex-1 overflow-y-auto'>
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default MainContent;
