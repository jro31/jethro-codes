import useSectionDetails from '../../../../hooks/useSectionDetails';
import useActiveSection from '../../../../hooks/useActiveSection';
import PageHeader from '../PageHeader';

const SectionHomeHeader = props => {
  const sectionDetails = useSectionDetails();
  const activeSection = useActiveSection();

  return (
    <PageHeader heroImage={props.heroImage}>
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
    </PageHeader>
  );
};

export default SectionHomeHeader;
