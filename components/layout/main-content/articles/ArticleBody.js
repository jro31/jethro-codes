const ArticleBody = props => {
  return <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: props.content }} />;
};

export default ArticleBody;
