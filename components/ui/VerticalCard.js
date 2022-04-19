import Link from 'next/link';

import useHumanizedDate from '../../hooks/useHumanizedDate';

const VerticalCard = props => {
  const { title, description, slug, coverImage, published, section, minsToRead } =
    props.cardDetails;

  const humanizedDate = useHumanizedDate();

  return (
    <div className='flex flex-col rounded-lg shadow-lg overflow-hidden'>
      <div className='flex-shrink-0'>
        <img
          className='h-48 w-full object-cover'
          src={coverImage || 'images/matrix-jethro.jpeg'}
          alt={`${title} cover image`}
        />
      </div>
      <div className='flex-1 bg-white p-6 flex flex-col justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-indigo-600'>
            {section && (
              <Link href={`/${section}`}>
                <a className='hover:underline capitalize'>{section.slice(0, -1)}</a>
              </Link>
            )}
          </p>
          <Link href={`/${section && `${section}/`}${slug}`}>
            <a className='block mt-2'>
              <p className='text-xl font-semibold text-gray-900'>{title}</p>
              <p className='mt-3 text-base text-gray-500'>{description}</p>
            </a>
          </Link>
        </div>
        <div className='mt-12 flex space-x-1 text-sm text-gray-500'>
          <time dateTime={new Date(published)}>{humanizedDate(published)}</time>
          <span aria-hidden='true'>&middot;</span>
          <span>{minsToRead} min read</span>
        </div>
      </div>
    </div>
  );
};

export default VerticalCard;
