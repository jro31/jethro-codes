import Link from 'next/link';

import { stockImagePath } from '../layout';
import { packages, projects, templates } from '../../hooks/useSectionDetails';

const HorizontalCard = props => {
  const { title, description, slug, coverImage, section } = props.cardDetails;

  const buttonText = () => {
    switch (section) {
      case packages:
        return 'View package';
      case projects:
        return 'Anatomy of a project';
      case templates:
        return 'View details';
      default:
        throw new Error(
          `Unrecognised section '${section}' passed to buttonText function of HorizontalCard`
        );
    }
  };

  return (
    <div className='max-w-7xl bg-indigo-600 lg:bg-transparent lg:px-8 rounded-lg lg:rounded-3xl pt-6 lg:pt-0'>
      <div className='lg:grid lg:grid-cols-12'>
        <div className='relative z-10 lg:col-start-1 lg:row-start-1 lg:col-span-4 lg:py-16 lg:bg-transparent'>
          <div className='max-w-md mx-auto px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:p-0'>
            <div className='aspect-w-10 aspect-h-6 sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1'>
              <img
                className='object-cover object-center rounded-lg lg:rounded-3xl shadow-2xl'
                src={coverImage || stockImagePath}
                alt=''
              />
            </div>
          </div>
        </div>

        <div className='relative bg-indigo-600 lg:col-start-3 lg:row-start-1 lg:col-span-10 lg:grid lg:grid-cols-10 lg:items-center rounded-lg lg:rounded-3xl'>
          <div
            className='hidden absolute inset-0 overflow-hidden rounded-3xl lg:block'
            aria-hidden='true'
          >
            <svg
              className='absolute bottom-full left-full transform translate-y-1/3 -translate-x-2/3 xl:bottom-auto xl:top-0 xl:translate-y-0'
              width={404}
              height={384}
              fill='none'
              viewBox='0 0 404 384'
              aria-hidden='true'
            >
              <defs>
                <pattern
                  id='64e643ad-2176-4f86-b3d7-f2c5da3b6a6d'
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits='userSpaceOnUse'
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className='text-indigo-500'
                    fill='currentColor'
                  />
                </pattern>
              </defs>
              <rect width={404} height={384} fill='url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)' />
            </svg>
            <svg
              className='absolute top-full transform -translate-y-1/3 -translate-x-1/3 xl:-translate-y-1/2'
              width={404}
              height={384}
              fill='none'
              viewBox='0 0 404 384'
              aria-hidden='true'
            >
              <defs>
                <pattern
                  id='64e643ad-2176-4f86-b3d7-f2c5da3b6a6d'
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits='userSpaceOnUse'
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className='text-indigo-500'
                    fill='currentColor'
                  />
                </pattern>
              </defs>
              <rect width={404} height={384} fill='url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)' />
            </svg>
          </div>
          <div className='relative max-w-md mx-auto py-12 px-4 space-y-6 sm:max-w-3xl sm:py-16 sm:px-6 lg:max-w-none lg:p-0 lg:col-start-4 lg:col-span-6'>
            <h2 className='text-3xl font-extrabold text-white' id='join-heading'>
              {title}
            </h2>
            <p className='text-lg text-white'>{description}</p>
            <Link href={`/${section}/${slug}`}>
              <a className='block w-full py-3 px-5 text-center bg-white border border-transparent rounded-md shadow-md text-base font-medium text-indigo-700 hover:bg-gray-50 sm:inline-block sm:w-auto'>
                {buttonText()}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalCard;
