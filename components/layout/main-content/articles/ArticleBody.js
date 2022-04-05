const ArticleBody = props => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: props.content }} />
    </div>
  );
};

export default ArticleBody;
