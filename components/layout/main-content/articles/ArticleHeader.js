const ArticleHeader = props => {
  return (
    <div className='bg-white'>
      <div className='max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <div className='text-base font-semibold text-indigo-600 tracking-wide uppercase'>
            {/* TODO - Should be dynamic */}
            Project
          </div>
          <h1 className='mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl'>
            {props.title}
          </h1>
          <p className='max-w-xl my-5 mx-auto text-xl text-gray-500'>{props.description}</p>
          <div className='flex flex-wrap justify-center gap-2'>
            {props.tagsArray.map(tag => (
              <span
                key={`${tag}-tag`}
                className='inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleHeader;
