import MainContent from './main-content';
import Navbar from './navbar';

export const baseUrl = 'https://code.jethrowilliams.com';
export const stockImagePath = '/images/matrix-jethro.jpeg';

const Layout = props => {
  return (
    <div className='h-full flex flex-col md:flex-row'>
      <Navbar />
      <MainContent>{props.children}</MainContent>
    </div>
  );
};

export default Layout;
