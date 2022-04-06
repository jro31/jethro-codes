import Link from 'next/link';

import useSectionDetails from '../../../hooks/useSectionDetails';
import useIsActiveSection from '../../../hooks/useIsActiveSection';
import { sectionOrder } from '..';
import Logo from '../../ui/svg/Logo';

import { navColorClasses } from '.';

const DesktopSidebar = () => {
  const sectionDetails = useSectionDetails();
  const isActiveSection = useIsActiveSection();

  return (
    <div className={`hidden w-28 overflow-y-auto md:block ${navColorClasses.background}`}>
      <div className='w-full py-6 flex flex-col items-center'>
        <div className='flex-shrink-0 flex items-center'>
          <div className='w-8 h-8'>
            <Logo />
          </div>
        </div>
        <div className='flex-1 mt-6 w-full px-2 space-y-1'>
          {sectionOrder.map(sectionName => {
            let section = sectionDetails(sectionName);
            return (
              <Link key={section.linkText} href={section.route}>
                <a
                  className={`group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium
                    ${
                      isActiveSection(sectionName)
                        ? navColorClasses.activePanel
                        : navColorClasses.passivePanel
                    }`}
                  aria-current={isActiveSection(sectionName) ? 'page' : undefined}
                >
                  <section.icon
                    className={`h-6 w-6 ${
                      isActiveSection(sectionName)
                        ? navColorClasses.activeIcon
                        : navColorClasses.passiveIcon
                    }`}
                    aria-hidden='true'
                  />
                  <span className='mt-2'>{section.linkText}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
