const Title = props => {
  return (
    <h1 className='text-4xl font-bold text-white sm:text-5xl sm:tracking-tight lg:text-6xl'>
      {props.children}
    </h1>
  );
};

export default Title;
