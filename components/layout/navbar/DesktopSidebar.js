import Link from 'next/link';

import useSectionDetails from '../../../hooks/useSectionDetails';
import useIsCurrentPage from '../../../hooks/useIsCurrentPage';
import { sectionOrder } from '..';

const DesktopSidebar = () => {
  const sectionDetails = useSectionDetails();
  const isCurrentPage = useIsCurrentPage();

  return (
    <div className='hidden w-28 bg-indigo-700 overflow-y-auto md:block'>
      <div className='w-full py-6 flex flex-col items-center'>
        <div className='flex-shrink-0 flex items-center'>
          <img
            className='h-8 w-auto'
            src='https://tailwindui.com/img/logos/workflow-mark.svg?color=white'
            alt='Workflow'
          />
        </div>
        <div className='flex-1 mt-6 w-full px-2 space-y-1'>
          {sectionOrder.map(sectionName => {
            let section = sectionDetails(sectionName);
            return (
              <Link key={section.linkText} href={section.route}>
                <a
                  className={classNames(
                    isCurrentPage(sectionName)
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                    'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium'
                  )}
                  aria-current={isCurrentPage(sectionName) ? 'page' : undefined}
                >
                  <section.icon
                    className={`h-6 w-6 ${
                      isCurrentPage(sectionName)
                        ? 'text-white'
                        : 'text-indigo-300 group-hover:text-white'
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
