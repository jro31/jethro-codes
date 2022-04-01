const MainContent = props => {
  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      <div className='flex-1 flex items-stretch overflow-hidden'>
        <main className='flex-1 overflow-y-auto'>{props.children}</main>
      </div>
    </div>
  );
};

export default MainContent;
