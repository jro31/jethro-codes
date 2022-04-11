const ArticleBody = props => {
  return (
    <div className='flex justify-center max-w-7xl mx-auto py-4 px-4 lg:py-8 sm:px-6 lg:px-8'>
      <div
        className='prose 2xl:max-w-[900px] prose-img:rounded-md prose-img:shadow-lg prose-code:before:content-none prose-code:after:content-none prose-code:text-[#e7e9eb] prose-code:bg-[#404245] prose-code:p-1 prose-code:rounded prose-code:font-normal'
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
    </div>
  );
};

export default ArticleBody;
