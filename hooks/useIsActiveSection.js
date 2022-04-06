import useActiveSection from './useActiveSection';

const useIsActiveSection = () => {
  const activeSection = useActiveSection();

  const isActiveSection = sectionName => sectionName === activeSection();

  return isActiveSection;
};

export default useIsActiveSection;
