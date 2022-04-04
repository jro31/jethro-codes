import useActiveSection from '../../../hooks/useActiveSection';
import useSectionDetails from '../../../hooks/useSectionDetails';

const MainContent = props => {
  const activeSection = useActiveSection();
  const sectionDetails = useSectionDetails();

  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      <div className='flex-1 flex items-stretch overflow-hidden'>
        <div className='flex-1 overflow-y-auto'>
          <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4'>
            {sectionDetails(activeSection()).title && (
              <div className='flex-1 min-w-0'>
                <h1 className='text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate'>
                  {sectionDetails(activeSection()).title}
                </h1>
              </div>
            )}
            {props.children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
