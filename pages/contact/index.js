import Dots from './Dots';

const inputClasses =
  'py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md';
const labelClasses = 'block text-sm font-medium text-gray-700';

const Contact = () => {
  return (
    <div className='bg-gray-50 py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24'>
      <div className='relative max-w-xl mx-auto'>
        <Dots positionClasses='left-full' translateClass='translate-x-1/2' />
        <Dots positionClasses='right-full bottom-0' translateClass='-translate-x-1/2' />
        <div className='text-center'>
          <h2 className='text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
            Get in touch
          </h2>
          <p className='mt-4 text-lg leading-6 text-gray-500'>
            Interested in working together, any comments or questions, or just want to say hi, send
            me an email below.
          </p>
        </div>
        <div className='mt-12'>
          <form
            action='#'
            method='POST'
            className='grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8'
          >
            <div>
              <label htmlFor='first-name' className={labelClasses}>
                First name
              </label>
              <div className='mt-1'>
                <input
                  type='text'
                  name='first-name'
                  id='first-name'
                  autoComplete='given-name'
                  className={inputClasses}
                />
              </div>
            </div>
            <div>
              <label htmlFor='last-name' className={labelClasses}>
                Last name
              </label>
              <div className='mt-1'>
                <input
                  type='text'
                  name='last-name'
                  id='last-name'
                  autoComplete='family-name'
                  className={inputClasses}
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label htmlFor='email' className={labelClasses}>
                Email
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  className={inputClasses}
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label htmlFor='message' className={labelClasses}>
                Message
              </label>
              <div className='mt-1'>
                <textarea
                  id='message'
                  name='message'
                  rows={4}
                  className={`${inputClasses} border`}
                  defaultValue={''}
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <button
                type='submit'
                className='w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Send email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
