import { Fragment, useState } from 'react';
import Link from 'next/link';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Dialog, Transition } from '@headlessui/react';

import useSectionDetails from '../../../hooks/useSectionDetails';
import useIsCurrentPage from '../../../hooks/useIsCurrentPage';
import { sectionOrder } from '..';
import Logo from '../../ui/svg/Logo';

const MobileNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sectionDetails = useSectionDetails();
  const isCurrentPage = useIsCurrentPage();

  return (
    <>
      <div className='flex-1 min-w-0 flex flex-col overflow-hidden'>
        <div className='md:hidden'>
          <div className='bg-indigo-600 py-2 px-4 flex items-center justify-between sm:px-6 lg:px-8'>
            <div className='h-8 w-8'>
              <Logo />
            </div>
            <div>
              <button
                type='button'
                className='-mr-3 h-12 w-12 inline-flex items-center justify-center bg-indigo-600 rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className='sr-only'>Open sidebar</span>
                <MenuIcon className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as='div' className='md:hidden' onClose={setMobileMenuOpen}>
          <div className='fixed inset-0 z-40 flex'>
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-gray-600 bg-opacity-75' />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'
            >
              <div className='relative max-w-xs w-full bg-indigo-700 pt-5 pb-4 flex-1 flex flex-col'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-in-out duration-300'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in-out duration-300'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <div className='absolute top-1 right-0 -mr-14 p-1'>
                    <button
                      type='button'
                      className='h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <XIcon className='h-6 w-6 text-white' aria-hidden='true' />
                      <span className='sr-only'>Close sidebar</span>
                    </button>
                  </div>
                </Transition.Child>
                <div className='flex-shrink-0 px-4 flex items-center'>
                  <div className='h-8 w-8'>
                    <Logo />
                  </div>
                </div>
                <div className='mt-5 flex-1 h-0 px-2 overflow-y-auto'>
                  <nav className='h-full flex flex-col'>
                    <div className='space-y-1'>
                      {sectionOrder.map(sectionName => {
                        let section = sectionDetails(sectionName);
                        return (
                          <Link key={section.linkText} href={section.route}>
                            <a
                              onClick={() => setMobileMenuOpen(false)}
                              className={`group py-2 px-3 rounded-md flex items-center text-sm font-medium ${
                                isCurrentPage(sectionName)
                                  ? 'bg-indigo-800 text-white'
                                  : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                              }`}
                              aria-current={isCurrentPage(sectionName) ? 'page' : undefined}
                            >
                              <section.icon
                                className={`mr-3 h-6 w-6 ${
                                  isCurrentPage(sectionName)
                                    ? 'text-white'
                                    : 'text-indigo-300 group-hover:text-white'
                                }`}
                                aria-hidden='true'
                              />
                              <span>{section.linkText}</span>
                            </a>
                          </Link>
                        );
                      })}
                    </div>
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className='flex-shrink-0 w-14' aria-hidden='true'>
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default MobileNavbar;
