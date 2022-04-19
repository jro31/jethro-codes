const ArticleBody = props => {
  return (
    <section className='-mt-32 max-w-7xl mx-auto relative z-10 md:pb-6 sm:px-6 lg:px-8'>
      <div className='flex justify-center py-4 px-4 lg:py-8 sm:px-6 lg:px-8 bg-white rounded-lg shadow'>
        <div
          className='prose 2xl:max-w-[900px] prose-img:m-0 prose-img:rounded-md prose-img:shadow-lg prose-code:before:content-none prose-code:after:content-none prose-code:text-[#e5e7eb] prose-code:bg-[#1f2937] prose-code:py-1 prose-code:rounded-md prose-code:font-normal'
          dangerouslySetInnerHTML={{ __html: props.content }}
        />
      </div>
    </section>
  );
};

export default ArticleBody;
