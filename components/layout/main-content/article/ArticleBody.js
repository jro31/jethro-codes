const ArticleBody = props => {
  return (
    <div className='flex justify-center'>
      <div className='prose' dangerouslySetInnerHTML={{ __html: props.content }} />
    </div>
  );
};

export default ArticleBody;
