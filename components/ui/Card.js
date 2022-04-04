import Link from 'next/link';
import Button from './Button';

const Card = props => {
  const { title, description, route, picture } = props.cardDetails;

  return (
    <div className='bg-white overflow-hidden shadow sm:rounded-lg md:min-h-[50vh]'>
      <div className='flex justify-between px-4 py-5 sm:p-6'>
        <div className='flex flex-col justify-between px-4 py-5 sm:px-6'>
          <h2 className='text-lg leading-6 font-medium text-gray-900'>{title}</h2>
          <div>{description}</div>
          <Link href={route} passHref>
            <Button>Anatomy of a project</Button>
          </Link>
        </div>
        <div className='basis-2/3 rounded-lg border'>
          <img src={picture} alt={title} className='rounded-lg' />
        </div>
      </div>
    </div>
  );
};

export default Card;
