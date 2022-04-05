import Link from 'next/link';
import Button from './Button';

const Card = props => {
  const { title, description, slug, coverImage, tags } = props.cardDetails;

  return (
    <div className='bg-white overflow-hidden shadow sm:rounded-lg md:min-h-[50vh]'>
      <div className='flex justify-between px-4 py-5 sm:p-6'>
        <div className='flex flex-col justify-between px-4 py-5 sm:px-6'>
          <h2 className='text-lg leading-6 font-medium text-gray-900'>{title}</h2>
          <div>{description}</div>
          <div>
            {tags.split(', ').map(tag => (
              <span key={`${tag}-tag`}>{tag}</span>
            ))}
          </div>
          <Link href={`${props.containingFolder}/${slug}`} passHref>
            <Button>Anatomy of a project</Button>
          </Link>
        </div>
        <div className='basis-2/3 rounded-lg border'>
          <img src={coverImage} alt={title} className='rounded-lg' />
        </div>
      </div>
    </div>
  );
};

export default Card;
