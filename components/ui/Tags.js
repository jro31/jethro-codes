const Tags = props => {
  return (
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
  );
};

export default Tags;
