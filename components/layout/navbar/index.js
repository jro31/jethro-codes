import DesktopSidebar from './desktopSidebar';
import MobileNavbar from './MobileNavbar';

export const navColorClasses = {
  background: 'bg-indigo-700',
  activeBackground: 'bg-indigo-800',
  icon: 'text-indigo-300', // Restart the server on changing this
  activeIcon: 'text-white', // Restart the server on changing this
  text: 'text-indigo-100',
  activeText: 'text-white',
  ring: 'ring-white',
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
