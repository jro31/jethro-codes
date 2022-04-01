import DesktopSidebar from './desktopSidebar';
import MobileNavbar from './MobileNavbar';

const Navbar = () => {
  return (
    <div className='md:h-full flex'>
      <DesktopSidebar />
      <MobileNavbar />
    </div>
  );
};

export default Navbar;
