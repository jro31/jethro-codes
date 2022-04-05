const CardsContainer = props => {
  return (
    <div className='flex flex-col gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4'>
      {props.children}
    </div>
  );
};

export default CardsContainer;
