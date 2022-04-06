import DesktopSidebar from './desktopSidebar';
import MobileNavbar from './MobileNavbar';

export const navColorClasses = {
  background: 'bg-indigo-700',
  activePanel: 'bg-indigo-800 text-white',
  passivePanel: 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
  activeIcon: 'text-white',
  passiveIcon: 'group-hover:text-white text-indigo-300',
  ring: 'focus:ring-white',
  hamburgerHover: 'hover:bg-indigo-800',
};

const Navbar = () => {
  return (
    <div className='md:h-full flex'>
      <DesktopSidebar />
      <MobileNavbar />
    </div>
  );
};

export default Navbar;
