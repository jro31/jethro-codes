import { stockImagePath } from '..';

const PageHeader = props => {
  return (
    <div className='relative pb-32 bg-gray-800'>
      <div className='absolute inset-0'>
        <img
          className={`w-full h-full ${props.heroImage ? 'object-cover' : 'object-contain'}`}
          src={props.heroImage || stockImagePath}
          alt=''
        />
        <div className='absolute inset-0 bg-gray-800 mix-blend-multiply' aria-hidden='true' />
      </div>
      {props.children}
    </div>
  );
};

export default PageHeader;
