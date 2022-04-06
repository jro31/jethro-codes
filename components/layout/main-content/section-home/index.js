import SectionHomeContainer from './SectionHomeContainer';
import SectionHomeHeader from './SectionHomeHeader';

const SectionHome = props => {
  return (
    <>
      <SectionHomeHeader />
      <SectionHomeContainer>{props.children}</SectionHomeContainer>
    </>
  );
};

export default SectionHome;
