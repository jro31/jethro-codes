import MainContent from './main-content';
import Navbar from './navbar';

export const home = 'home';
export const projects = 'projects';

export const sectionOrder = [home, projects];

const Layout = props => {
  return (
    <div className='h-full flex flex-col md:flex-row'>
      <Navbar />
      <MainContent>{props.children}</MainContent>
    </div>
  );
};

export default Layout;
