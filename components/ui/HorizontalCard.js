import { useRouter } from 'next/router';

import Button from './Button';

const HorizontalCard = props => {
  const router = useRouter();

  const { title, description, slug, coverImage, tags, section } = props.cardDetails;

  return (
    <div className='bg-white overflow-hidden shadow rounded-lg md:min-h-[50vh]'>
      <div className='flex justify-between px-4 py-5 sm:p-6'>
        <div className='flex flex-col justify-between px-4 py-5 sm:px-6'>
          <h2 className='text-lg leading-6 font-medium text-gray-900'>{title}</h2>
          <div>{description}</div>
          <div>
            {tags.split(', ').map(tag => (
              <span key={`${tag}-tag`}>{tag}</span>
            ))}
          </div>
          <Button onClick={() => router.push(`${section}/${slug}`)}>
            {/* TODO - Update this text */}
            Anatomy of a project
          </Button>
        </div>
        <div className='basis-2/3 rounded-lg border'>
          {/* TODO - Add a default image (as in 'src={coverImage || 'images/defaultImage.png'}) in case no cover image exists */}
          <img src={coverImage} alt={title} className='rounded-lg' />
        </div>
      </div>
    </div>
  );
};

export default HorizontalCard;