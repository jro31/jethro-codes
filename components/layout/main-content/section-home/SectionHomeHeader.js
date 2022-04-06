import useSectionDetails from '../../../../hooks/useSectionDetails';
import useActiveSection from '../../../../hooks/useActiveSection';

const SectionHomeHeader = () => {
  const sectionDetails = useSectionDetails();
  const activeSection = useActiveSection();

  return (
    <div className='relative pb-32 bg-gray-800'>
      <div className='absolute inset-0'>
        <img
          className='w-full h-full object-cover'
          src='https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&&sat=-100' // TODO - Update this image
          alt=''
        />
        <div className='absolute inset-0 bg-gray-800 mix-blend-multiply' aria-hidden='true' />
      </div>
      <div className='relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8'>
        {sectionDetails(activeSection()).title && (
          <h1 className='text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl'>
            {sectionDetails(activeSection()).title}
          </h1>
        )}
        {sectionDetails(activeSection()).description && (
          <p className='mt-6 max-w-3xl text-xl text-gray-300'>
            {sectionDetails(activeSection()).description}
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionHomeHeader;
