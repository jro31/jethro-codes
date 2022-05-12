const ArticleBody = props => {
  return (
    <section className='-mt-32 max-w-7xl mx-auto relative z-10 md:pb-6 sm:px-6 lg:px-8'>
      <div className='flex justify-center py-4 px-4 lg:py-8 sm:px-6 lg:px-8 bg-white rounded-lg shadow'>
        <div
          className='prose max-w-full 2xl:max-w-[900px] prose-img:m-0 prose-img:rounded-md prose-img:shadow-lg prose-pre:max-w-full'
          dangerouslySetInnerHTML={{ __html: props.content }}
        />
      </div>
    </section>
  );
};

export default ArticleBody;
